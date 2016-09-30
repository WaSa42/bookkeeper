import moment from 'moment';
import { Accounts } from '/imports/api/collections';

Meteor.methods({
    challenge6: function (doc) {
        const writings = [];
        const now = moment();
        const values = {
            date: now.toDate(),
            formattedDate: now.format('DD/MM/YYYY')
        };

        if (doc.sumptuary) {
            const account = Accounts.findOne({
                num: doc.sumptuaryAccountNum
            });

            if (account) {
                writings.push({
                    ...values,
                    accountNum: 'F19',
                    accountLab: 'DIVERGENCES DÉFINITIVES',
                    lab: 'Dépenses somptuaires',
                    journalCode: 'OF',
                    debit: Math.abs(account.balance),
                    credit: 0
                });

                writings.push({
                    ...values,
                    accountNum: `F${doc.sumptuaryAccountNum}`,
                    accountLab: 'Dépenses somptuaires',
                    lab: 'Dépenses somptuaires',
                    journalCode: 'OF',
                    debit: 0,
                    credit: Math.abs(account.balance)
                });
            }
        }

        if (doc.quote) {
            if (doc.quoteAmount > 0) {
                writings.push({
                    ...values,
                    accountNum: 'F19',
                    accountLab: 'DIVERGENCES DÉFINITIVES',
                    lab: 'Quote part RF Société transparente',
                    journalCode: 'OF',
                    debit: doc.quoteAmount,
                    credit: 0
                });

                writings.push({
                    ...values,
                    accountNum: 'F761',
                    accountLab: 'Quote part RF Société transparente',
                    lab: 'Quote part RF Société transparente',
                    journalCode: 'OF',
                    debit: 0,
                    credit: doc.quoteAmount
                });
            } else if (doc.quoteAmount < 0) {
                writings.push({
                    ...values,
                    accountNum: 'F668',
                    accountLab: 'Quote part RF Société transparente',
                    lab: 'Quote part RF Société transparente',
                    journalCode: 'OF',
                    debit: doc.quoteAmount,
                    credit: 0
                });

                writings.push({
                    ...values,
                    accountNum: 'F19',
                    accountLab: 'DIVERGENCES DÉFINITIVES',
                    lab: 'Quote part RF Société transparente',
                    journalCode: 'OF',
                    debit: 0,
                    credit: doc.quoteAmount
                });
            }
        }

        if (doc.shares) {
            const account = Accounts.findOne({
                num: doc.sharesAccountNum
            });

            if (account) {
                writings.push({
                    ...values,
                    accountNum: `F${doc.sharesAccountNum}`,
                    accountLab: 'Dividende société transparente',
                    lab: 'Dividende société transparente',
                    journalCode: 'OF',
                    debit: Math.abs(account.balance),
                    credit: 0
                });

                writings.push({
                    ...values,
                    accountNum: 'F19',
                    accountLab: 'Dividende société transparente',
                    lab: 'Dividende société transparente',
                    journalCode: 'OF',
                    debit: 0,
                    credit: Math.abs(account.balance)
                });
            }
        }

        if (doc.bonus) {
            const account = Accounts.findOne({
                num: doc.bonusAccountNum
            });

            if (account) {
                writings.push({
                    ...values,
                    accountNum: `F482`,
                    accountLab: 'Primes d\'Assurance vie',
                    lab: 'Primes d\'Assurance vie',
                    journalCode: 'OF',
                    debit: Math.abs(account.balance),
                    credit: 0
                });

                writings.push({
                    ...values,
                    accountNum: `F${doc.bonusAccountNum}`,
                    accountLab: 'Primes d\'Assurance vie',
                    lab: 'Primes d\'Assurance vie',
                    journalCode: 'OF',
                    debit: 0,
                    credit: Math.abs(account.balance)
                });
            }
        }

        if (doc.accident) {
            const account = Accounts.findOne({
                num: doc.accidentAccountNum
            });

            if (account) {
                writings.push({
                ...values,
                accountNum: `F775`,
                accountLab: 'Sinistre',
                lab: 'Sinistre',
                journalCode: 'OF',
                debit: Math.abs(account.balance),
                credit: 0
                });

                writings.push({
                ...values,
                accountNum: 'F482',
                accountLab: 'Sinistre',
                lab: 'Sinistre',
                journalCode: 'OF',
                debit: 0,
                credit: Math.abs(account.balance)
                });
            }
        }

        Meteor.call('insertFiscalWritings', writings);
    }
});
