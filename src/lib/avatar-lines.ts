// Avatar states and their default lines. No DOM or React here, so build scripts can import it.
export type AvatarState =
  | 'idle' | 'greeting' | 'about' | 'experience' | 'skills' | 'achievement'
  | 'presenting' | 'education' | 'contact' | 'explaining';

// Default lines: `scroll` while a section is in view, `hover` when the visitor points at it.
export const LINES: Record<AvatarState, { scroll: string; hover: string }> = {
  idle: { scroll: 'Hello, I’m Ravi Kumar. Explore my journey in finance leadership, transformation and global operations.', hover: 'Hello, I’m Ravi Kumar. Welcome to my portfolio.' },
  greeting: { scroll: 'Hello, I’m Ravi Kumar. Explore my journey in finance leadership, transformation and global operations.', hover: 'Welcome. Let me walk you through my journey.' },
  about: { scroll: 'Chartered Accountant, 15+ years across controllership, FP&A and finance transformation.', hover: 'A quick look at who I am and how I work.' },
  experience: { scroll: 'Explore my 15+ year journey across Miles Education, Grant Thornton and Aris Global.', hover: 'Explore my 15+ year journey across global finance and advisory.' },
  skills: { scroll: 'My expertise spans FP&A, controllership, US GAAP, IFRS, ERP transformation and global finance.', hover: 'See the financial frameworks and capabilities I work across.' },
  achievement: { scroll: 'Explore some of the transformation and transaction milestones from my career.', hover: 'Explore transformation, ERP, IPO and transaction milestones.' },
  presenting: { scroll: 'From financial complexity to scalable growth, one stage at a time.', hover: 'This is how I turn finance into strategic impact.' },
  education: { scroll: 'I am a Chartered Accountant from ICAI.', hover: 'My journey as a Chartered Accountant started here.' },
  contact: { scroll: 'Let’s connect.', hover: 'Let’s connect.' },
  explaining: { scroll: 'Pick a question and I’ll explain.', hover: 'Ask me anything from my resume.' },
};

