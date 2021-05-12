import AWS from 'aws-sdk';
import { FileUpload, GraphQLUpload } from 'graphql-upload';
import { Arg, Authorized, ID, Mutation, Resolver } from 'type-graphql';
import { Repository } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';

import { Media as MediaEntity } from '@/db/entities/Media';
import * as errors from '@/graphql/errors';
import { Media } from '@/graphql/types/Media';
import { MediaType } from '@/graphql/types/MediaType';
import { Permission } from '@/graphql/types/Permission';
import { convertFromDBModel as convertFromMediaDBModel } from '@/lib/modelConversions/media';
import { randomId } from '@/lib/random';

const S3 = new AWS.S3();

@Resolver(of => Media)
export class MediaMutationResolver {
  constructor(
    @InjectRepository(MediaEntity)
    private readonly _media: Repository<MediaEntity>,
  ) {}

  @Authorized(Permission.ManageProperties)
  @Mutation(returns => Media, {
    description: 'Upload a media file',
  })
  async createMedia(
    @Arg('file', type => GraphQLUpload) file: FileUpload,
    @Arg('type') type: MediaType,
  ) {
    const src = await new Promise<string>((res, rej) => {
      const fileStream = file.createReadStream();
      const fileName = randomId();

      fileStream.on('error', () => {
        rej(new errors.FailedFileParse(file.filename));
      });

      const params = {
        ACL: 'public-read',
        Body: fileStream,
        Bucket: 'maha.media',
        Key: fileName,
      };

      S3.upload(params, (err: Error, data: any) => {
        if (err) {
          rej(new errors.FailedUpload(file.filename));
        } else {
          res(data.Location);
        }
      });
    });

    const media = this._media.create({ src, type, data: { sizes: {} } });
    await this._media.save(media);
    return convertFromMediaDBModel(media);
  }

  @Authorized(Permission.ManageProperties)
  @Mutation(returns => Media, {
    description: 'Removes a media file',
  })
  async deleteMedia(@Arg('id', type => ID) id: string) {
    const media = await this._media.findOne({ where: { id } });

    if (!media) {
      throw new errors.DoesNotExist('id', id);
    }

    await this._media.delete(media.id);
    return convertFromMediaDBModel(media);
  }
}
