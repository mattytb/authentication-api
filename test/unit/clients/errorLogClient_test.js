import * as Chai from 'chai';
import Sinon from 'sinon';
import { logError } from '../../../lib/clients/errorLogClient';
import * as newErrorLogProvider from '../../../lib/models/providers/newErrorLogProvider';
const Expect = Chai.expect;
import * as ErrorLogUtils from '../../../lib/models/utils/errorLogUtils';

describe('Unit::errorLogClient', () => {

    describe('When logging an error', () => {

        it('should request a error log is provided with error', ()=> {
            Expect(providingNewErrorLog).calledWith(error);
        });

        it('it should request the error log be saved', () => {
			Expect(savingErrorLog).calledWith(providedErrorLog);
		}); 

		it('it should return true to indicate log has been saved', () => {
			return result.then((data) => {
				Expect(data).to.equal(true);
			});
        });
        
        const error = {},
            providedErrorLog = { message:'error' };

        let providingNewErrorLog,
            savingErrorLog,
            result,
			sandbox = Sinon.sandbox.create();

        beforeEach(() => {
            providingNewErrorLog = sandbox.stub(newErrorLogProvider, 'provideNewErrorLog').callsFake(() => { return providedErrorLog });
            savingErrorLog = sandbox.stub(ErrorLogUtils, 'saveErrorLog').returnsPromise();
            savingErrorLog.resolves(true);
            result = logError(error);
        });

        afterEach(function() {
			sandbox.restore();
		});
			
    });
});