import { Mongo } from 'meteor/mongo';
import moment from 'moment';

export const Writings = new Mongo.Collection('writings');
export const Accounts = new Mongo.Collection('accounts');
export const Differences = new Mongo.Collection('differences');
export const DifferencesRules = new Mongo.Collection('DifferencesRules');
export const Logs = new Mongo.Collection('logs');

Writings.helpers({
    getAccountName: function () {
        return `${this.accountNum} ${this.accountLab}`;
    },
    getDate: function () {
        return moment(this.writingDate).format('DD/MM/YYYY');
    }
});
