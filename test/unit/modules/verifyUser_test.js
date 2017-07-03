import * as UserClient from '../../../clients/userClient';
import * as TokenClient from '../../../clients/tokenClient';
import { verifyUser } from '../../../modules/verifyUser';
import Sinon from 'sinon';
import * as Chai from 'chai';

const Expect = Chai.expect;

describe('Unit::Module verifyUser', () => {

	describe('when successfully verifing a user', () => {

		it('it request to verify the token', () => {
			Expect(verifingToken).calledWith(token);
		});

		it('it should request user by id', () => {
			Expect(gettingUserById).calledWith(userId);
		});

		it('it should confirm the user is verified', () => {
			return result.then((data) => {
				Expect(data).to.equal(true);
			});
		});

		const token = 'token',
			userId = 123;

		let verifingToken,
			gettingUserById,
			verifiedToken = true,
			fetchedUser = {
				name:'matt',
				email:'email',
				token:'token',
				password:'hash',
				_id:123,
				admin:true
			},
			result,
			sandbox = Sinon.sandbox.create();

		beforeEach(() => {
			verifingToken = sandbox.stub(TokenClient, 'verifyToken').returnsPromise();
			verifingToken.resolves(verifiedToken);
			gettingUserById = sandbox.stub(UserClient, 'getUserById').returnsPromise();
			gettingUserById.resolves(fetchedUser);
			result = verifyUser(userId, token);
		});

		afterEach(function() {
			sandbox.restore();
		});

	});
	
	// need to figure out how to test rejections 

	// describe('when rejecting a user beacause the token is invalid', () => {

	// 	it('it request to verify the token', () => {
	// 		Expect(verifingToken).calledWith(token);
	// 	});

	// 	it('it should not request user by id', () => {
	// 		Expect(gettingUserById).not.calledWith(userId);
	// 	});

	// 	it('it should return the error message', () => {
	// 		return result.then((data) => {
	// 			Expect(data).to.be.rejected.and.to.eventually.deep.equal(errorMessage);
	// 		});
	// 	});

	// 	const token = 'token',
	// 		userId = 123,
	// 		errorMessage = "Invalid user";

	// 	let verifingToken,
	// 		gettingUserById,
	// 		inValidToken = false,
	// 		result,
	// 		sandbox = Sinon.sandbox.create();

	// 	beforeEach(() => {
	// 		verifingToken = sandbox.stub(TokenClient, 'verifyToken').returnsPromise();
	// 		verifingToken.resolves(inValidToken);
	// 		gettingUserById = sandbox.stub(UserClient, 'getUserById').returnsPromise();
	// 		result = verifyUser(userId, token);
	// 	});

	// 	afterEach(function() {
	// 		sandbox.restore();
	// 	});

	// });

	// describe('when rejecting a user because the token does not match the users token we got form the id supplied', () => {

	// 	it('it request to verify the token', () => {
	// 		Expect(verifingToken).calledWith(token);
	// 	});

	// 	it('it should not request user by id', () => {
	// 		Expect(gettingUserById).calledWith(userId);
	// 	});

	// 	it('it should return the error message', () => {
	// 		return result.then(() => {
	// 			Expect(result).to.be.rejected.and.to.eventually.deep.equal(errorMessage);
	// 		});
	// 	});

	// 	const token = 'token',
	// 		userId = 123,
	// 		errorMessage = "Invalid user";

	// 	let verifingToken,
	// 		gettingUserById,
	// 		validToken = true,
	// 		result,
	// 		fetchedUser = {
	// 			name:'matt',
	// 			email:'email',
	// 			token:'a different token',
	// 			password:'hash',
	// 			_id:123,
	// 			admin:true
	// 		},
	// 		sandbox = Sinon.sandbox.create();

	// 	beforeEach(() => {
	// 		verifingToken = sandbox.stub(TokenClient, 'verifyToken').returnsPromise();
	// 		verifingToken.resolves(validToken);
	// 		gettingUserById = sandbox.stub(UserClient, 'getUserById').returnsPromise();
	// 		gettingUserById.resolves(fetchedUser);
	// 		result = verifyUser(userId, token);
	// 	});

	// 	afterEach(function() {
	// 		sandbox.restore();
	// 	});
	// });
});