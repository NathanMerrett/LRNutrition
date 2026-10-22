/**
 * Services and prices: the single source for the /services page and the
 * homepage teaser, so the two can never disagree.
 *
 * Fees are also mentioned on the terms page ("Fees, payment and
 * cancellation"), so keep that in step when prices change.
 */

/**
 * The introductory offer is for Laura's first five clients. Once those places
 * are taken, set this to false: the offer disappears from both the services
 * page and the homepage teaser.
 */
export const SHOW_OFFER = true;

export const OFFER_TEXT =
  'My first five clients will receive a free initial consultation and discounted follow-up sessions, at just £20 per session!';

export interface Service {
  title: string;
  price: number;
  duration: string;
  desc: string;
}

export const services: Service[] = [
  {
    title: 'Discovery call',
    price: 0,
    duration: '15 minutes',
    desc: 'We’ll have a short telephone call to get to know each other and what you’d like to achieve. If you fall within my scope of practice and I am a good fit for your goals, we can move forward with booking in your initial consultation, following the completion of your pre-assessment questionnaire.',
  },
  {
    title: 'Initial consultation',
    price: 50,
    duration: '1 hour',
    desc: 'This first session we have together will be a longer and more thorough evaluation of you and your needs. We’ll complete a full nutrition assessment, understand your medical history and your lifestyle in order to tailor a plan which works best for you and your goals.',
  },
  {
    title: 'Follow-up sessions',
    price: 30,
    duration: '30 minutes',
    desc: 'During our follow-up sessions we’ll monitor your progress, make adjustments to your plan and identify and address any barriers you are facing. We can also work on longer term habit adaptation and ongoing education to keep you on track.',
  },
];

export function formatPrice(price: number): string {
  return price === 0 ? 'Free' : `£${price}`;
}
