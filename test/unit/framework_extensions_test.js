import Sinon from 'sinon';
import SinonStubPromise from 'sinon-stub-promise';
import SinonChai from 'sinon-chai';
import * as Chai from 'chai';
import ChaiAsPromised from 'chai-as-promised';

Chai.use(SinonChai);
Chai.use(ChaiAsPromised);
SinonStubPromise(Sinon);