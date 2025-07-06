import moment from 'moment';

export const hourChart = (date: Date): string => moment(date).format('MMMM DD YYYY, h:mm A');
