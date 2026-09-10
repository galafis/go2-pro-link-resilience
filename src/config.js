export default {
  slug: 'go2-pro-link-resilience',
  title: 'Go2 PRO Link Resilience',
  color: '#966013',
  group: 'Unitree Go2 PRO',
  tagline: {
    en: 'Expose delivery delays and expired messages in intermittent links.',
    pt: 'Identifique atrasos de entrega e mensagens expiradas em conexões intermitentes.',
  },
  description:
    'EN: Expose delivery delays and expired messages in intermittent links. PT: Identifique atrasos de entrega e mensagens expiradas em conexões intermitentes.',
  topics: [
    'unitree-go2',
    'robotics',
    'research-prototype',
    'bilingual',
    'javascript',
    'communications',
    'discrete-event-simulation',
    'telemetry',
  ],
  setting: {
    key: 'ttlScale',
    label: {
      en: 'Message lifetime multiplier',
      pt: 'Multiplicador de validade das mensagens',
    },
    min: 0.1,
    max: 10,
    step: 0.1,
  },
  default: 1,
};
