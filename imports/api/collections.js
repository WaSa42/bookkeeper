import { Mongo } from 'meteor/mongo';

export const Writings = new Mongo.Collection('writings');
export const Accounts = new Mongo.Collection('accounts');
export const Differences = new Mongo.Collection('differences');
export const DifferencesRules = new Mongo.Collection('DifferencesRules');
export const Logs = new Mongo.Collection('logs');

Writings.helpers({
    accountName: function () {
        return `${this.accountNum} ${this.accountLib}`;
    }
});
