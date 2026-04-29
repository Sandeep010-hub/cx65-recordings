import type { Recording } from '../../store/useStore';

const firstNames = ['James', 'Emma', 'Liam', 'Olivia', 'Noah', 'Ava', 'William', 'Sophia', 'Lucas', 'Isabella'];
const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez'];
const queues = ['Customer Support', 'Sales', 'Technical Helpdesk', 'Billing'];

const getRandomItem = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
const getRandomPhone = () => `+1 (${Math.floor(Math.random() * 900) + 100}) ${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`;

export const generateMockRecordings = (count: number): Recording[] => {
  const recordings: Recording[] = [];
  const now = new Date();

  for (let i = 0; i < count; i++) {
    const isOutbound = Math.random() > 0.6;
    const direction = isOutbound ? 'Outbound' : (Math.random() > 0.8 ? 'Internal' : 'Inbound');
    
    const startTime = new Date(now.getTime() - Math.random() * 86400000 * 7); // Up to 7 days ago
    
    recordings.push({
      id: `rec_${1000 + i}`,
      ani: direction === 'Inbound' ? getRandomPhone() : 'System',
      dnis: direction === 'Outbound' ? getRandomPhone() : 'Queue',
      startTime: startTime.toISOString(),
      callFlow: 'Main IVR > Agent',
      duration: Math.floor(Math.random() * 1800) + 30, // 30s to 30min
      direction,
      agent: `${getRandomItem(firstNames)} ${getRandomItem(lastNames)}`,
      queue: getRandomItem(queues),
    });
  }

  return recordings.sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime());
};

export const mockRecordings = generateMockRecordings(15);
