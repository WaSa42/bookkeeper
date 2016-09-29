import json2csv from 'json2csv';
import moment from 'moment';
import { Writings } from '/imports/api/collections';

const fields = [
    {
        label: 'EcritureDate',
        value: writing => moment(writing.date).format('YYYYMMDD')
    }, {
        label: 'JournalCode',
        value: () => 'RF'
    }, {
        label: 'CompteNum',
        value: 'accountNum'
    }, {
        label: 'EcritureLib',
        value: 'lab'
    }, {
        label: 'Debit',
        value: 'debit'
    }, {
        label: 'Credit',
        value: 'credit'
    }
];

Router.route('/export/:format', function () {
    this.response.writeHead(200, {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename=ecritures.${this.params.format}`
    });

    const data = Writings.find({
        accountNum: /^F/
    }).fetch();

    this.response.end(json2csv({
        delimiter: '\t',
        fields,
        data
    }));
}, { where: 'server' });
