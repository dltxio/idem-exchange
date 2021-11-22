import { KMS } from 'aws-sdk';
// import * as asn1 from "asn1.js";
const asn = require('asn1.js');

const aws_key_id =
  process.env.AWS_KEY_ID || '3d5cc04b-01ce-4c17-850c-269722e22239';

const kms = new KMS({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION || 'ap-southeast-1',
  apiVersion: '2014-11-01',
});

const getPublicKey = async (keyPairId: string) => {
  return kms
    .getPublicKey({
      KeyId: keyPairId,
    })
    .promise();
};

export const getAwsPubKey = async (): Promise<any> => {
  const result = await getPublicKey(aws_key_id);
  const pubKey = result.PublicKey?.toString('hex');
  console.log(pubKey);
  return pubKey;
};

const EcdsaPubKey = asn.define('EcdsaPubKey', function (this: any) {
  // https://tools.ietf.org/html/rfc5480#section-2
  this.seq().obj(
    this.key('algo')
      .seq()
      .obj(this.key('algorithm').objid(), this.key('parameters').objid()),
    this.key('pubKey').bitstr() // <-- this is what we want
  );
});

export const getEthPubKey = async (): Promise<any> => {
  const result = await getPublicKey(aws_key_id);
  const pubKey = result.PublicKey?.toString('hex');

  const res = EcdsaPubKey.decode(result.PublicKey, 'der');
  const pubKeyBuffer: Buffer = res.pubKey.data;
  console.log('Pub Key Buffer: ' + pubKeyBuffer.toString('hex'));
  // console.log(res);

  return pubKeyBuffer.toString('hex');
};
