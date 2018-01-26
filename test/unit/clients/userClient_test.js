import * as Chai from 'chai';
import Sinon from 'sinon';
import * as UserClient from '../../../lib/clients/userClient';
import bcrypt from 'bcryptjs';
import * as User from '../../../lib/models/user';
import mongoose from 'mongoose';
import * as newUserProvider from '../../../lib/models/providers/newUserProvider';
import * as userUtils from '../../../lib/models/utils/userUtils';

const Expect = Chai.expect;

describe('Unit::userClient', () => {

	describe('When getting user by email', () => {

		it('it should request the user by email', () => {
			Expect(gettingUserByEmail).calledWith({email:email});
		});

		it('it should return the user', () => {
			return result.then((data) =>{
				Expect(data).to.equal(fetchedUser);
			})
		});

		const email = 'matt@email.com',
			fetchedUser = {
				'name':'matt',
				'_id' : 123,
				'email':'matt@email.com'
			};

		let gettingUserByEmail,
			result,
			sandbox = Sinon.sandbox.create();

		beforeEach(() => {
			
			gettingUserByEmail = sandbox.stub(mongoose.Model, 'findOne').returnsPromise();
			gettingUserByEmail.resolves(fetchedUser);
			result = UserClient.getUserByEmail(email);
		});

		afterEach(function() {
			sandbox.restore();
		});
	});
	
	describe('When successfully getting user by id', () => {

		it('it should request user by id', () => {
			Expect(gettingUserById).calledWith(id);
		});

		it('it should return the user', () => {
			return result.then((data) =>{
				Expect(data).to.equal(fetchedUser);
			})
		});

		const id = 123,
			fetchedUser = {
				'name':'matt',
				'_id' : 123
			};

		let gettingUserById,
			result,
			sandbox = Sinon.sandbox.create();

		beforeEach(() => {
			
			gettingUserById = sandbox.stub(mongoose.Model, 'findById').returnsPromise();
			gettingUserById.resolves(fetchedUser);
			result = UserClient.getUserById(id);
		});

		afterEach(function() {
			sandbox.restore();
		});
		
	});
	

	describe('When successfully getting user by email and password', () => {

		it('it should request the user by email', () => {
			Expect(gettingUserByEmail).calledWith({email:email});
		});

		it('it should test the password against the password provided and the fetched users password', () => {
			Expect(evaluatingBcryptPassword).calledWith(password, fetchedUser.password);
		});

		it('it should return the user', () => {
			return result.then(function(data) {
				Expect(data).to.equal(fetchedUser);
			});
		});

		const email = "matt@email.com",
			password = "password",
			fetchedUser = {
				'name':'matt',
				'email':'matt@email.com',
				'_id' : 123,
				'password':'password'
			};

		let gettingUserByEmail,
			result,
			evaluatingBcryptPassword,
			sandbox = Sinon.sandbox.create();

		beforeEach(() => {
			
			gettingUserByEmail = sandbox.stub(mongoose.Model, 'findOne').returnsPromise();
			gettingUserByEmail.resolves(fetchedUser);
			evaluatingBcryptPassword = sandbox.stub(bcrypt, 'compare').returnsPromise();
			evaluatingBcryptPassword.resolves(true);
			result = UserClient.getUserByEmailAndPassword(email, password);
			
		});

		afterEach(function() {
			sandbox.restore();
		});
	});

	describe('When successfully saving a new user', () => {

		it('it should request a new user providing username, email and admin', () => {
			Expect(providingUser).calledWith(username, email, admin);
		});

		it('it should request the amount of salt rounds to use in hashing', () => {
			Expect(providingSaltRounds).to.be.called;
		})

		it('it should request hashing of the provided password', ()=>{
			Expect(hashingPassword).calledWith(password, providedSaltRounds);
		});

		it('it have placed the hash on the fetched user', () => {
			Expect(providedUser.password).to.equal(hash);
		});

		it('it should request the provided user be saved', () => {
			Expect(savingUser).calledWith(providedUser);
		}); 

		it('it should return the saved user', () => {
			return result.then((data) => {
				Expect(data).to.equal(savedUser);
			});
		});

		const username = 'matt',
			email = 'email',
			admin = false,
			hash = 'hash',
			password = 'password',
			providedUser = {
				'name':'matt',
				'email':'email',
				'admin':false
			},
			savedUser = {
				'name':'matt',
				'email':'email',
				'admin':false,
				'password':'hash'
			},
			providedSaltRounds = 2;

		let providingUser,
			providingSaltRounds,
			hashingPassword,
			savingUser,
			result,
			sandbox = Sinon.sandbox.create();

		beforeEach(() => {
			providingUser = sandbox.stub(newUserProvider, 'provideNewUser').callsFake(() => {return providedUser});
			providingSaltRounds = sandbox.stub(userUtils, 'getSaltRounds').callsFake(() => {return providedSaltRounds});
			hashingPassword = sandbox.stub(bcrypt, 'hash').returnsPromise();
			hashingPassword.resolves(hash);
			savingUser = sandbox.stub(userUtils, 'saveUser').returnsPromise();
			savingUser.resolves(savedUser);
			result = UserClient.saveNewUser(username, password,email, admin);
		});

		afterEach(function() {
			sandbox.restore();
		});

	});

	describe('When successfully saving a third party user', () => {

		it('it should request a new user providing username, email and admin', () => {
			Expect(providingUser).calledWith(username, email, admin);
		});

		it('it should request the provided user be saved', () => {
			Expect(savingUser).calledWith(providedUser);
		}); 

		it('it should return the saved user', () => {
			return result.then((data) => {
				Expect(data).to.equal(savedUser);
			});
		});

		const username = 'matt facebook',
			email = 'email@facebook.com',
			admin = false,
			providedUser = {
				'name':'matt facebook',
				'email':'email@facebook.com',
				'admin':false
			},
			savedUser = {
				'name':'matt facebook',
				'email':'email@facebook.com',
				'admin':false,
			},
			providedSaltRounds = 2;

		let providingUser,
			providingSaltRounds,
			hashingPassword,
			savingUser,
			result,
			sandbox = Sinon.sandbox.create();

		beforeEach(() => {
			providingUser = sandbox.stub(newUserProvider, 'provideNewUser').callsFake(() => {return providedUser});
			savingUser = sandbox.stub(userUtils, 'saveUser').returnsPromise();
			savingUser.resolves(savedUser);
			result = UserClient.saveThirdPartyUser(username, email, admin);
		});

		afterEach(function() {
			sandbox.restore();
		});

	});

	describe('When successfully getting users', () => {

		it('it should make a request for the users', () => {
			Expect(gettingUsers).to.be.called;
		});
		
		it('it should return users found', () => {
			return result.then((data) => {
				Expect(data).to.equal(fetchedUsers);
			});
		});

		const fetchedUsers = [{"name":"user1"}, {"name":"user2"}];

		let gettingUsers,
			result,
			sandbox = Sinon.sandbox.create();

		beforeEach(() => {
		
			gettingUsers = sandbox.stub(mongoose.Model, 'find').returnsPromise();
			gettingUsers.resolves(fetchedUsers);
			result = UserClient.getUsers();
		});

		afterEach(function() {
			sandbox.restore();
		});
	});

	describe('When successfully deleting a user', () => {

		it('it should make a request to delete a sepecific user by there id', () => {
			Expect(deletingUser).calledWith({ _id: userIdToDelete });
		});
		
		it('it should return the deleted users id', () => {
			return result.then((data) => {
				Expect(data).to.equal(deletedUser._id);
			});
		});

		const deletedUser = {"name":"deletedUser", "_id":123},
			userIdToDelete = 123;

		let deletingUser,
			result,
			sandbox = Sinon.sandbox.create();

		beforeEach(() => {
			deletingUser = sandbox.stub(mongoose.Model, 'findOneAndRemove').returnsPromise();
			deletingUser.resolves(deletedUser);
			result = UserClient.deleteUserById(userIdToDelete);
		});

		afterEach(function() {
			sandbox.restore();
		});
	});
});
