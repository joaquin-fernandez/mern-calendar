import 'whatwg-fetch';
// import 'setimmediate';
import { TextDecoder, TextEncoder } from 'util';
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

require('dotenv').config({
    path: '.env.test',
});

jest.mock('./src/helpers/getEnvVariables', () => ({
    getEnvVariables: () => ({ ...process.env }),
}));
