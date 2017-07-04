import Sinon from 'sinon';
import SinonStubPromise from 'sinon-stub-promise';
import SinonChai from 'sinon-chai';
import * as Chai from 'chai';

Chai.use(SinonChai);
SinonStubPromise(Sinon);