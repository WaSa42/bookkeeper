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
            accountNum: `F${writing.accountNum}`,
            accountLab: getLabel(difference.creditAccount, writing),
            debit: 0,
            credit: writing.debit
        };

        debitFiscalWriting = {
            ...values,
            accountNum: 'F19',
            accountLab: getLabel(difference.debitAccount, writing),
            debit: writing.debit,
            credit: 0
        };
    } else {
        debitFiscalWriting = {
            ...values,
            accountNum: `F${writing.accountNum}`,
            accountLab: getLabel(difference.debitAccount, writing),
            debit: writing.credit,
            credit: 0
        };

        creditFiscalWriting = {
            ...values,
            accountNum: 'F19',
            accountLab: getLabel(difference.creditAccount, writing),
            debit: 0,
            credit: writing.credit
        }
    }

    return [
        debitFiscalWriting,
        creditFiscalWriting
    ];
};
