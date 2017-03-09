'use strict';

const expect = require('chai').expect;
const request = require('superagent');
const mongoose = require('mongoose');
const Promise = require('bluebird');

const User = require('../model/user.js');
const Group = require('../model/group.js');

require('../server.js');

const url = `http://localhost:${process.env.PORT}`;

mongoose.Promise = Promise;

const exampleUser = {
  username: 'exampleuser',
  password: '1234',
  email: 'exampleuser@test.com'
};

const exampleGroup = {
  name: 'examplegroup',
  description: 'example group description'
};

describe('Group Routes', function() {
  afterEach( done => {
    Promise.all([
      User.remove({}),
      Group.remove({})
    ])
    .then( () => done())
    .catch(done);
  });

// ------------------------------
// POST
// ------------------------------

  describe('POST: /api/group', () => {
    before( done => {
      new User(exampleUser)
      .generatePasswordHash(exampleUser.password)
      .then( user => user.save())
      .then( user => {
        this.tempUser = user;
        return user.generateToken();
      })
      .then( token => {
        this.tempToken = token;
        done();
      })
      .catch(done);
    });

    it('should return a group', done => {
      request.post(`${url}/api/group`)
      .send(exampleGroup)
      .set({
        Authorization: `Bearer ${this.tempToken}`
      })
      .end((err, res) => {
        if (err) return done(err);
        let date = new Date(res.body.created).toString();
        expect(res.body.name).to.equal(exampleGroup.name);
        expect(res.body.description).to.equal(exampleGroup.description);
        expect(res.body.userID).to.equal(this.tempUser._id.toString());
        expect(date).to.not.equal('Invalid Date');
        done();
      });
    });
  });

// -------------------------------
// GET
// -------------------------------

  describe('GET /api/group/:id', () => {
    before( done => {
      new User(exampleUser)
      .generatePasswordHash(exampleUser.password)
      .then( user => user.save())
      .then( user => {
        this.tempUser = user;
        console.log('\n::: temp user is', user, '\n');
        return user.generateToken();
      })
      .then( token => {
        this.tempToken = token;
        console.log('\n::: temp token is: ', token, '\n');
        done();
      })
      .catch(done);
    });

    before( done => {
      exampleGroup.userID = this.tempUser._id.toString();
      new Group(exampleGroup).save()
      .then( group => {
        this.tempGroup = group;
        console.log('\n::: temp group is:', group, '\n');
        done();
      })
      .catch(done);
    });

    after( () => {
      console.log('\n::: ABOUT TO DELETE AFTER\n');
      delete exampleGroup.userID;
    });

    it('should return a group', done => {
      console.log('\n::: JUST BEFORE GET REQUEST \n');
      request.get(`${url}/api/group/${this.tempGroup._id}`)
      .set({
        Authorization: `Bearer ${this.tempToken}`
      })
      .end((err, res) => {
        console.log('\n::: REACHED ME? \n');
        console.log('\n::: res.body is:', res.body, '\n');
        console.log('\n::: res.body.name is:', res.body.name, '\n');
        console.log('\n::: res.body.userID is:', res.body.userID, '\n');
        if (err) return done(err);
        let date = new Date(res.body.created).toString();
        expect(res.body.name).to.equal(exampleGroup.name);
        expect(res.body.description).to.equal(exampleGroup.description);
        expect(res.body.userID).to.equal(this.tempUser._id.toString());
        expect(date).to.not.equal('Invalid Date');
        done();
      });
    });

  });
});
