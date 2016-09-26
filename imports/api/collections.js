import { Mongo } from 'meteor/mongo';

export const Accounts = new Mongo.Collection('accounts');
export const Differences = new Mongo.Collection('differences');
export const DifferencesRules = new Mongo.Collection('DifferencesRules');
export const Journals = new Mongo.Collection('journals');
export const Writings = new Mongo.Collection('writings');
