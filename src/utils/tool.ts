import NodeRSA from 'node-rsa';

export function encryptWithRSA(publicKey: string, data: string): string {
    const key = new NodeRSA(publicKey);
    return key.encrypt(data, 'base64');
}