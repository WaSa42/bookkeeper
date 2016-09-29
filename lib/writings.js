import moment from 'moment';
import { Differences } from '/imports/api/collections';

function getLabel(accountNum, writing) {
    return accountNum === 'F19'
        ? 'DIVERGENCES DÉFINITIVES'
        : `${writing.lab}, AJUSTEMENT FISCAL`;
}

getWritings = function (writing) {
    const difference = Differences.findOne(writing.differenceId);
    const now = moment();
    const values = {
        originalWritingId: writing._id,
        date: now.toDate(),
        formattedDate: now.format('DD/MM/YYYY')
    };

    let debitFiscalWriting;
    let creditFiscalWriting;

    if (writing.debit !== 0) {
        creditFiscalWriting = {
            ...values,
            accountNum: difference.creditAccount === 'auto'
                ? `F${writing.accountNum}`
                : difference.creditAccount,
            accountLab: getLabel(difference.creditAccount, writing),
            lab: writing.lab,
            journalCode: 'F',
            debit: 0,
            credit: writing.debit
        };

        debitFiscalWriting = {
            ...values,
            accountNum: difference.debitAccount  === 'auto'
                ? `F${writing.accountNum}`
                : difference.debitAccount,
            accountLab: getLabel(difference.debitAccount, writing),
            lab: writing.lab,
            journalCode: 'F',
            debit: writing.debit,
            credit: 0
        };
    } else {
        debitFiscalWriting = {
            ...values,
            accountNum: difference.debitAccount === 'auto'
                ? `F${writing.accountNum}`
                : difference.debitAccount,
            accountLab: getLabel(difference.debitAccount, writing),
            lab: writing.lab,
            journalCode: 'F',
            debit: writing.credit,
            credit: 0
        };

        creditFiscalWriting = {
            ...values,
            accountNum: difference.creditAccount === 'auto'
                ? `F${writing.accountNum}`
                : difference.creditAccount,
            accountLab: getLabel(difference.creditAccount, writing),
            lab: writing.lab,
            journalCode: 'F',
            debit: 0,
            credit: writing.credit
        }
    }

    return [
        debitFiscalWriting,
        creditFiscalWriting
    ];
};
