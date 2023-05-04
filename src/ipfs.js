const IPFS = require('ipfs-http-client');
import { Buffer } from 'buffer';

window.Buffer = Buffer;
const projectId = "2NGssZWpyyobzEfoR1VJsrwz4s2"
const projectSecret = "be3870338e592a43f84bf10cef1d0716"
const auth = 'Basic ' + Buffer.from(projectId + ':' + projectSecret).toString('base64');
const ipfs = new IPFS({
    host: 'ipfs.infura.io',
    port: 5001,
    protocol: 'https',
    headers: {
        authorization: auth,
    },
});


export default ipfs
