declare namespace server {

  type IdentityRequestData = {
    claims: Claim[];
    connectionID: string;
  }

  type Claim = {
    "@context": string[];
    id?: string;
    key: string;
    type: string[];
    credentialSubject: CredentialSubject[];
    proof: Proof;
    issuer: string;
    issuanceDate: Date;
    expirationDate?: Date;
    credentialStatus?: CredentialStatus;
  };

  interface CredentialSubject {
    id?: string;
    name: string;
    value: any;
  }

  interface Proof {
    type: string;
  }
  
  interface CredentialStatus {
    id: string;
    type: string
  }
}
