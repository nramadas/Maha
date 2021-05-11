const colors = require('colors/safe');
const inquirer = require('inquirer');
const f = require('node-fetch');

const { connectToDb } = require('@/db');
const repos = require('@/db/repositories').default;
const { createUser, initiatePasswordlessLogin } = require('@/lib/authn/api');
const { extractAuthId } = require('@/lib/authn/token');
const { CommonRoleType } = require('@/models/CommonRoleType');

globalThis.fetch = f;

async function makeUser(email: string, firstName?: string, lastName?: string) {
  const _users = repos.User();
  const result = await createUser(email);

  if (!result.ok) {
    throw new Error(
      `Something went wrong when trying to add user to the authn db. User: ${email}`,
    );
  }

  const idToken = result.idToken;
  const authId = await extractAuthId(idToken);

  if (!authId) {
    throw new Error(
      `Something went wrong when trying to extract the auth id. User: ${email}`,
    );
  }

  const user = _users.create({
    email,
    authId,
    data: { firstName, lastName },
  });

  await _users.save(user);

  initiatePasswordlessLogin(email);

  return {
    id: user.id,
    jwt: idToken,
  };
}

async function makeOrg(name: string, ownerId: string) {
  const _organizations = repos.Organization();
  const _roles = repos.Role();
  const _users = repos.User();

  const user = await _users.findOne({ where: { id: ownerId } });

  if (!user) {
    throw new Error('Owner does not seem to be established yet');
  }

  const org = _organizations.create({
    name,
    data: {},
    users: [user],
  });

  await _organizations.save(org);

  await Promise.all(
    Object.values(CommonRoleType).map(async roleName => {
      const role = _roles.create({
        name: roleName,
        organizationId: org.id,
        data: {},
      });

      if (roleName === CommonRoleType.Owner) {
        role.users = (role.users || []).concat(user);
      }

      await _roles.save(role);
    }),
  );

  return {
    id: org.id,
  };
}

async function main() {
  await connectToDb();

  const answers = await inquirer.prompt([
    {
      name: 'adminEmail',
      message: "What's your email?",
    },
    {
      name: 'testOrg',
      message: "What's the name of the test organization?",
    },
    {
      name: 'ownerEmail',
      message: "What's the email for the organization's owner?",
    },
    {
      name: 'ownerFirstName',
      message: "What's the owner's first name?",
    },
    {
      name: 'ownerLastName',
      message: "What's the owner's last name?",
    },
  ]);

  // Create the users in the authn db
  await Promise.all([
    makeUser(answers.adminEmail),
    makeUser(answers.ownerEmail, answers.ownerFirstName, answers.ownerLastName),
  ])
    .then(([user, owner]) => {
      console.log(colors.green('\nAdmin account:'));
      console.log('  ' + colors.bold('ID:  ') + colors.reset(user.id));
      console.log('  ' + colors.bold('JWT: ') + colors.reset(user.jwt));

      console.log(colors.green('\nOwner account:'));
      console.log('  ' + colors.bold('ID:  ') + colors.reset(owner.id));
      console.log('  ' + colors.bold('JWT: ') + colors.reset(owner.jwt));

      return makeOrg(answers.testOrg, owner.id);
    })
    .then(org => {
      console.log(colors.green('\nTest organization:'));
      console.log('  ' + colors.bold('ID:  ') + colors.reset(org.id));
    })
    .then(() => process.exit());
}

main();

export {};
