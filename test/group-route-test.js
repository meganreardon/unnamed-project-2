'use strict';

const expect = require('chai').expect;
const request = require('superagent');
const mongoose = require('mongoose');
const Promise = require('bludebird');

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

  describe('POST: /api/gallery', () => {
    before( done => {
      new User(exampleUser)
      .generatePasswordHas(exampleUser.password)
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
      request.post(`${url}/api/gallery`)
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

  describe('GET /api/gallery/:id', () => {
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

    before( done => {
      exampleGroup.userID = this.tempUser._id.toString();
      new Group(exampleGroup).save()
      .then( group => {
        this.tempGroup = group;
        done();
      })
      .catch(done);
    });

    after( () => {
      delete exampleGroup.userID;
    });

    it('should return a group', done => {
      request.get(`${url}/api/gallery/${this.tempGroup._id}`)
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
});
