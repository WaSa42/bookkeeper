import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { TAPi18n } from 'meteor/tap:i18n';

import { Accounts, Writings } from '../imports/api/collections';

if (Meteor.isClient) {
    Template.tabular.onCreated(function () {
        $.extend(true, $.fn.dataTable.defaults, {
            language: {
                decimal: TAPi18n.__('tableDef.decimal'),
                emptyTable: TAPi18n.__('tableDef.emptyTable'),
                info: TAPi18n.__('tableDef.info'),
                infoEmpty: TAPi18n.__('tableDef.infoEmpty'),
                infoFiltered: TAPi18n.__('tableDef.infoFiltered'),
                infoPostFix: TAPi18n.__('tableDef.infoPostFix'),
                thousands: TAPi18n.__('tableDef.thousands'),
                lengthMenu: TAPi18n.__('tableDef.lengthMenu'),
                loadingRecords: TAPi18n.__('tableDef.loadingRecords'),
                processing: TAPi18n.__('tableDef.processing'),
                search: TAPi18n.__('tableDef.search'),
                zeroRecords: TAPi18n.__('tableDef.zeroRecords'),
                paginate: {
                    first: TAPi18n.__('tableDef.paginate.first'),
                    last: TAPi18n.__('tableDef.paginate.last'),
                    next: TAPi18n.__('tableDef.paginate.next'),
                    previous: TAPi18n.__('tableDef.paginate.previous')
                },
                aria: {
                    sortAscending: TAPi18n.__('tableDef.aria.sortAscending'),
                    sortDescending: TAPi18n.__('tableDef.aria.sortDescending')
                }
            }
        });
    });
}

TabularTables = {};

TabularTables.Accounts = new Tabular.Table({
    name: 'Accounts',
    collection: Accounts,
    columns: [
        {data: 'id', title: '#'},
        {data: 'title', title: 'Libellé'},
        // {data: 'type', title: 'Type'},
        {data: 'balance', title: 'Solde'}
    ]
});

TabularTables.Writings = new Tabular.Table({
    name: 'Writings',
    collection: Writings,
    columns: [
        {data: 'writingNum', title: '#'},
        {data: 'formatDate', title: 'Date'},
        {data: 'writingLab', title: 'Libellé'},
        {data: 'accountName', title: 'Compte'},
        {data: 'debit', title: 'Débit'},
        {data: 'credit', title: 'Crédit'}
    ]
});
