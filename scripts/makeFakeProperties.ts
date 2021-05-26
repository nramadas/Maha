import fs from 'fs';
import path from 'path';

import AWS from 'aws-sdk';
import colors from 'colors/safe';
import inquirer from 'inquirer';
import sample from 'lodash/sample';
import sampleSize from 'lodash/sampleSize';
import fetch from 'node-fetch';

import { connectToDb } from '@/db';
import { School as SchoolEntity } from '@/db/entities/School';
import repos from '@/db/repositories';
import { MediaParentType } from '@/graphql/types/MediaParentType';
import { MediaType } from '@/graphql/types/MediaType';
import { patch, today } from '@/lib/date';
import { convertFromDBModel as convertFromOrganizationDBModel } from '@/lib/modelConversions/organization';
import { randomId } from '@/lib/random';
import { removeUndefinedKeys } from '@/lib/removeUndefinedKeys';
import { AmenityAccess } from '@/models/AmenityAccess';
import { MetropolitanKey } from '@/models/MetropolitanKey';
import { Organization } from '@/models/Organization';
import { Data } from '@/models/Property';
import { PropertyCondition } from '@/models/PropertyCondition';
import { PropertyType } from '@/models/PropertyType';
import { UtilityConfiguration } from '@/models/UtilityConfiguration';
import { UtilityGasType } from '@/models/UtilityGasType';
import { UtilityWaterFilter } from '@/models/UtilityWaterFilter';

import LOCATIONS from './locations.json';
import SCHOOLS from './schools.json';

// @ts-ignore
globalThis.fetch = fetch;

const S3 = new AWS.S3();

const ORG_NAMES = 'Brigade Group,Prestige Group,Sobha Limited,Puravankara,Century Real Estate,Shriram Properties,Provident Housing Limited,Pride Group,Vaishnavi Group,Salarpuria Sattva,Embassy Group,VBHC,Goyal And Co Group,Bren Corporation,Mahindra Lifespaces,House of Hiranandani'.split(
  ',',
);

const HOUSE_NAMES = 'Kanasu,Anugraha,Amruthabindu,Amruthavarshini,Aalok,Aakasha,Aadarsha,Aaradhana,Aashirvada,Ashraya,Aishwarya,Om,Chandana,Chandra,Chandrodaya,Chinthana,Chitra,Chitrita,Chinmaya,Chirayu,Chaaya,Tusti,Daya,Nakshatra,Nidhi,Prakriti,Prateeksha,Prarthana,Baduku,Hemaadri,Hongirana,Belaku,Brahmaputhra,Bhageeratha,Bavana,Bhavani,Bhagya,Bhavana,Bhuvi,Mamata,Munjavu,Vamana,Vijaya,Vinayaka,Visesha,Vishnu,Vismaya,Srishti,ಕನಸು,ಅನುಗ್ರಹ,ಅಮೃತಬಿಂದು,ಅಮೃತವರ್ಷಿಣಿ,ಅಲೋಕ್,ಆಕಾಶ,ಆದರ್ಶ,ಆರಾಧನಾ,ಆಶೀರ್ವಾದ,ಆಶ್ರಯ,ಐಶ್ವರ್ಯ,ಓಂ,ಚಂದನ ,ಚಂದ್ರ,ಚಂದ್ರೋದಯ,ಚಿಂತನ,ಚಿತ್ರ,ಚಿತ್ರಿತ,ಚಿನ್ಮಯ,ಚಿರಾಯು,ಛಾಯಾ,ತುಸ್ತಿ,ದಯಾ,ನಕ್ಷತ್ರ,ನಿಧಿ,ಪ್ರಕೃತಿ,ಪ್ರತೀಕ್ಷಾ,ಪ್ರಾರ್ಥನಾ,ಬದುಕು,ಹೇಮಾದ್ರಿ,ಹೊಂಗಿರಣ,ಬೆಳಕು,ಬ್ರಹ್ಮಪುತ್ರ,ಭಗೀರಥ,ಭವನ,ಭವಾನಿ,ಭಾಗ್ಯ,ಭಾವನಾ,ಭುವಿ,ಮಮತಾ,ಮುಂಜಾವು,ಮುಗಿಲು,ವಾಮನ,ವಿಜಯ,ವಿನಾಯಕ,ವಿಶೇಷ,ವಿಷ್ಣು,ವಿಸ್ಮಯ,ಸೃಷ್ಟಿ'.split(
  ',',
);
const WORDS = 'on,the,other,hand,we,denounce,with,righteous,indignation,and,dislike,men,who,are,so,beguiled,demoralized,by,charms,of,pleasure,moment,blinded,desire,that,they,cannot,foresee,pain,trouble,bound,to,ensue,equal,blame,belongs,those,fail,in,their,duty,through,weakness,will,which,is,same,as,saying,shrinking,from,toil,these,cases,perfectly,simple,easy,distinguish,a,free,hour,when,our,power,choice,untrammelled,nothing,prevents,being,able,do,what,like,best,every,be,welcomed,avoided,but,certain,circumstances,owing,claims,or,obligations,business,it,frequently,occur,pleasures,have,repudiated,annoyances,accepted,wise,man,therefore,always,holds,matters,this,principle,selection,he,rejects,secure,greater,else,endures,pains,avoid,worse'.split(
  ',',
);

function pickBoolean() {
  return sample([true, false]);
}

function pickDate() {
  const t = today();
  const year = sample([-2, -1, 0]);
  const month = sample([-12, -11, -10, -9, -8, -7, -6, -5, -4, -3, -2, -1]);
  return patch(t, { year, month });
}

function pickFloat(size: number) {
  return parseFloat((Math.random() * size).toFixed(2));
}

function pickFromEnum<E>(e: any): E | undefined {
  return sample<E>(Object.values(e) as E[]);
}

function pickInt(size: number) {
  return parseInt((Math.random() * size).toFixed(0), 10);
}

function pickText() {
  return sampleSize(WORDS, 10).join(' ');
}

function randomAttributes() {
  return {
    amenitiesGrill: pickFromEnum<AmenityAccess>(AmenityAccess),
    amenitiesGym: pickBoolean(),
    amenitiesPool: pickFromEnum<AmenityAccess>(AmenityAccess),
    amenitiesSecurity: pickBoolean(),
    appliancesDishwasher: pickBoolean(),
    appliancesDryer: pickFromEnum<AmenityAccess>(AmenityAccess),
    appliancesWasher: pickFromEnum<AmenityAccess>(AmenityAccess),
    built: pickDate(),
    constructionMaterials: {
      en: pickText(),
    },
    fees: pickFloat(10000),
    numBathrooms: pickInt(5),
    numBathroomsHalf: pickInt(5),
    numBedrooms: pickInt(5),
    parkingCoveredSpaces: pickInt(5),
    parkingGarage: pickBoolean(),
    parkingOpenSpaces: pickInt(5),
    price: pickFloat(20000000) + 1000000,
    propertyCondition: pickFromEnum<PropertyCondition>(PropertyCondition),
    quantity: pickInt(25),
    securityFeatures: {
      en: pickText(),
    },
    sqft: pickInt(2000) + 500,
    taxes: pickFloat(100000) + 20000,
    type: pickFromEnum<PropertyType>(PropertyType),
    utilitiesAirConditioning: pickFromEnum<UtilityConfiguration>(
      UtilityConfiguration,
    ),
    utilitiesGasType: pickFromEnum<UtilityGasType>(UtilityGasType),
    utilitiesHeating: pickFromEnum<UtilityConfiguration>(UtilityConfiguration),
    utilitiesWaterFilter: pickFromEnum<UtilityWaterFilter>(UtilityWaterFilter),
  } as Omit<Data, 'location' | 'name'>;
}

interface UnSavedProperty extends ReturnType<typeof randomAttributes> {
  location: typeof LOCATIONS[number];
  name: typeof HOUSE_NAMES[number];
}

const createMedia = (src: string, propertyId: string) => {
  const _media = repos.Media();
  const media = _media.create({
    src,
    parentId: propertyId,
    parentType: MediaParentType.Property,
    type: MediaType.Image,
    data: { sizes: {} },
  });

  return _media.save(media);
};

const createOrganization = (name: string) => {
  const _organizations = repos.Organization();
  const org = _organizations.create({
    name,
    data: {},
  });

  return _organizations.save(org);
};

async function createProperty(
  data: UnSavedProperty,
  organizationId: string,
  mediaUrls: string[],
  allSchools: SchoolEntity[],
  metropolitanKey: MetropolitanKey,
  orgName?: string,
) {
  const _properties = repos.Property();
  if (orgName) {
    console.log(` • Organization: ${orgName}`);
  }

  console.log(` • Name: ${data.name}`);

  console.log('   Assigning schools:');
  const schools = sampleSize(allSchools, 3);
  schools.forEach(school => {
    console.log(`    • ${school.name}`);
  });

  // @ts-ignore
  const newProperty = _properties.create({
    metropolitanKey,
    organizationId,
    schools,
    data: removeUndefinedKeys(data),
  });

  await _properties.save(newProperty);

  console.log('   Adding media:');
  await sampleSize(mediaUrls, 10).reduce<Promise<any>>((acc, url) => {
    return acc.then(() => {
      process.stdout.write(colors.reset(`    + ${url}`));

      return createMedia(url, newProperty.id).then(media => {
        process.stdout.write(colors.green('  √\n'));
      });
    });
  }, Promise.resolve());
}

const createSchool = (data: typeof SCHOOLS[number]) => {
  const _schools = repos.School();
  const newSchool = _schools.create({
    googleId: data.googleId,
    name: data.name,
    data: { location: data.location },
  });

  return _schools.save(newSchool);
};

const readBucket = () =>
  new Promise<string[]>((res, rej) => {
    const params = {
      Bucket: 'media.maha.homes',
    };

    S3.listObjects(params, (err: any, data: any) => {
      if (err) {
        return rej(err);
      }

      const filenames = data.Contents.map(
        (c: any) => `media.maha.homes/${c.Key}`,
      );
      res(filenames);
    });
  });

const uploadFile = (file: string) =>
  new Promise<string>((res, rej) => {
    const fileName = randomId();
    const fileStream = fs.createReadStream(file);

    const params = {
      ACL: 'public-read',
      Body: fileStream,
      Bucket: 'media.maha.homes',
      Key: fileName,
    };

    S3.upload(params, (err: any, data: any) => {
      if (err) {
        return rej(err);
      }

      return res(data.Location);
    });
  });

async function main() {
  await connectToDb();
  const answers = await inquirer.prompt([
    {
      name: 'orgId',
      message: 'Organization ID',
    },
    {
      choices: Object.values(MetropolitanKey),
      default: MetropolitanKey.Bengaluru,
      name: 'metropolitanKey',
      message: 'Metropolitan',
      type: 'list',
    },
    {
      default: false,
      name: 'redos3',
      message: 'Re-create S3 files?',
      type: 'confirm',
    },
  ]);

  console.log(answers);

  console.log(colors.yellow('\nCreating schools...'));

  const allSchools: SchoolEntity[] = [];

  await SCHOOLS.reduce<Promise<any>>((acc, data) => {
    return acc.then(() => {
      process.stdout.write(colors.reset(` + ${data.name}`));
      return createSchool(data).then(school => {
        allSchools.push(school);
        process.stdout.write(colors.green('  √\n'));
      });
    });
  }, Promise.resolve());

  console.log(colors.yellow('\nCreating organizations...'));

  const otherOrgs: Organization[] = [];

  await ORG_NAMES.reduce<Promise<any>>((acc, name) => {
    return acc.then(() => {
      process.stdout.write(colors.reset(` + ${name}`));
      return createOrganization(name).then(org => {
        otherOrgs.push(convertFromOrganizationDBModel(org));
        process.stdout.write(colors.green('  √\n'));
      });
    });
  }, Promise.resolve());

  let mediaUrls: string[] = [];

  if (answers.redos3) {
    console.log(colors.green('\nUploading media to S3...'));
    const files = fs.readdirSync(path.resolve(path.join(__dirname, '/images')));

    await files.reduce<Promise<any>>((acc, file) => {
      return acc.then(() => {
        process.stdout.write(colors.reset(` + ${file}`));

        return uploadFile(path.join(__dirname, 'images', file)).then(url => {
          mediaUrls.push(url);
          process.stdout.write(colors.green('  √\n'));
        });
      });
    }, Promise.resolve());
  } else {
    console.log(colors.yellow('\nPulling media from s3...'));
    mediaUrls = await readBucket();
    console.log(` • Found ${mediaUrls.length} files`);
  }

  console.log(colors.yellow('\nCreating properties...'));

  const properties = LOCATIONS.map((location, i) => ({
    ...randomAttributes(),
    location,
    name: HOUSE_NAMES[i],
  }));

  console.log('Assigning the first 20 properties to input organization');
  await properties.slice(0, 20).reduce<Promise<any>>((acc, data) => {
    return acc.then(() => {
      return createProperty(
        data,
        answers.orgId,
        mediaUrls,
        allSchools,
        answers.metropolitanKey,
      );
    });
  }, Promise.resolve());

  console.log('\nAssigning remaining properties in a round-robin fashion');
  await properties.slice(20).reduce<Promise<any>>((acc, data, index) => {
    return acc.then(() => {
      const org = otherOrgs[index % otherOrgs.length];

      return createProperty(
        data,
        org.id,
        mediaUrls,
        allSchools,
        answers.metropolitanKey,
        org.name,
      );
    });
  }, Promise.resolve());

  process.exit();
}

main();
