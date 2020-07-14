import AdmZip from "adm-zip";
import S3 from "aws-sdk/clients/s3";
import { S3Handler } from "aws-lambda";
const s3 = new S3();

const deleteSource = !!process.env.DELETE_SOURCE;
const destBucket: string = process.env.DEST_BUCKET!;
const destPrefix = process.env.DEST_PREFIX;
const destKey = process.env.DEST_KEY;
const matchRegex = new RegExp(process.env.MATCH_REGEX!);

const handler: S3Handler = async (event) => {
    const srcBucket = event.Records[0].s3.bucket.name;
    const srcKey = decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, " "));
    const srcParts = srcKey.split('/');
    const zipFilename = srcParts[srcParts.length - 1].replace('.zip', '');

    const response = await s3.getObject({
        Bucket: srcBucket,
        Key: srcKey
    }).promise();

    const body = response.Body! as Buffer;
    const zip = new AdmZip(body);
    const files = zip.getEntries();

    const filteredFiles = files
        .filter(file => file.entryName.match(matchRegex));

    for (const file of filteredFiles) {
        let parts = file.entryName.split('/');
        parts = parts[parts.length - 1].split('.');

        const extension = parts.pop();
        const filename = parts.join('.');

        const key = destKey ?
            destKey
                .replace('$zipFilename', zipFilename)
                .replace('$filename', filename)
                .replace('$extension', extension as string)
            : file.entryName;

        await s3.putObject({
            Bucket: destBucket,
            Key: destPrefix + key,
            Body: file.getData()
        }).promise();
    }


    if (deleteSource) {
        await s3.deleteObject({
            Bucket: srcBucket,
            Key: srcKey
        }).promise();
    }
};

export default handler;
