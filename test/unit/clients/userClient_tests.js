import * as Chai from 'chai';
import Sinon from 'sinon';
import * as UserClient from '../../../clients/userClient';
import bcrypt from 'bcryptjs';
import * as User from '../../../models/user';
import mongoose from 'mongoose';
import * as newUserProvider from '../../../models/providers/newUserProvider';
import * as UserUtils from '../../../models/utils/userUtils';

const Expect = Chai.expect;

describe('Unit::userClient', () => {

	describe('When getting user by name', () => {

		it('it should request the user by name', () => {
			Expect(gettingUserByName).calledWith({name:'matt'});
		});

		it('it should return the user', () => {
			return result.then((data) =>{
				Expect(data).to.equal(fetchedUser);
			})
		});

		const name = "matt",
			fetchedUser = {
				'name':'matt',
				'token':'token',
				'_id' : 123
			};

		let gettingUserByName,
			result,
			sandbox = Sinon.sandbox.create();

		beforeEach(() => {
			
			gettingUserByName = sandbox.stub(mongoose.Model, 'findOne').returnsPromise();
			gettingUserByName.resolves(fetchedUser);
			result = UserClient.getUserByName(name);
		});

		afterEach(function() {
			sandbox.restore();
		});

	});
	
	describe('When successfully getting user by id', () => {

		it('it should request user by id', () => {
			Expect(gettingUserById).calledWith({_id:id});
		});


		it('it should return the user', () => {
			return result.then((data) =>{
				Expect(data).to.equal(fetchedUser);
			})
		});

		const id = 123,
			fetchedUser = {
				'name':'matt',
				'token':'token',
				'_id' : 123
			};

		let gettingUserById,
			result,
			sandbox = Sinon.sandbox.create();

		beforeEach(() => {
			
			gettingUserById = sandbox.stub(mongoose.Model, 'findOne').returnsPromise();
			gettingUserById.resolves(fetchedUser);
			result = UserClient.getUserById(id);
		});

		afterEach(function() {
			sandbox.restore();
		});
	});
	

	describe('When successfully getting user by name and password', () => {

		it('it should request the user by name', () => {
			Expect(gettingUserByName).calledWith({name:name});
		});

		it('it should test the password against the password provided and the fetched users password', () => {
			Expect(evaluatingBcryptPassword).calledWith(password, fetchedUser.password);
		});

		it('it should return the user', () => {
			return result.then(function(data) {
				Expect(data).to.equal(fetchedUser);
			});
		});

		const name = "matt",
			password = "password",
			fetchedUser = {
					'name':'matt',
					'token':'token',
					'_id' : 123,
					'password':'password'
				};

		let gettingUserByName,
			result,
			evaluatingBcryptPassword,
			sandbox = Sinon.sandbox.create();

		beforeEach(() => {
			
			gettingUserByName = sandbox.stub(mongoose.Model, 'findOne').returnsPromise();
			gettingUserByName.resolves(fetchedUser);
			evaluatingBcryptPassword = sandbox.stub(bcrypt, 'compare').returnsPromise();
			evaluatingBcryptPassword.resolves(true);
			result = UserClient.getUserByNameAndPassword(name, password);
			
		});

		afterEach(function() {
			sandbox.restore();
		});
	});

	describe('When successfully saving a token to a user', () => {

		it('it should request the user by id', () => {
			Expect(gettingUserById).calledWith(id);
		});

		it('it should return the user with the token passed applied', () => {
			return result.then((data) => {
				Expect(data).to.equal(fetchedUser);
				Expect(data.token).to.equal(token);
			});
		});

		const id = 123,
			token = 'token',
			fetchedUser = {
				'name':'matt',
				'token':null,
				'_id' : 123,
				'save':Sinon.spy()
			};

		let gettingUserById,
			result,
			sandbox = Sinon.sandbox.create();

		beforeEach(() => {
			
			gettingUserById = sandbox.stub(mongoose.Model, 'findById').returnsPromise();
			gettingUserById.resolves(fetchedUser);
			result = UserClient.saveTokenToUser(id, token);
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
			result = UserClient.deleteUser(userIdToDelete);
		});

		afterEach(function() {
			sandbox.restore();
		});
	});
});
