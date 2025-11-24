export interface RangeExample {
  label: 'Low' | 'Medium' | 'High';
  description: string;
}

export interface GuidingQuestion {
  question: string;
  rangeExamples: [RangeExample, RangeExample, RangeExample];
}

export interface LastQuestion {
  question: string;
  type: 'text' | 'choice';
  options?: string[];
}

export interface Dimension {
  id: string;
  title: string;
  theme: string; // Poetic Theme
  description: string; // Descriptive Theme (New)
  goal: string;
  guidingQuestions: GuidingQuestion[];
  lastQuestion: LastQuestion;
  actionIdea: string;
  duoQuestions: string[]; 
  duoSentence: string;
  themeColor: string; 
}

export const DIMENSIONS: Dimension[] = [
  {
    id: '1',
    title: 'Truth Alignment',
    theme: 'Your truth takes shape when seen',
    description: 'Honesty, transparency, and accurate contact with reality',
    goal: 'Discover how clearly each partner sees themselves, each other, and the shared reality.',
    themeColor: 'blue',
    guidingQuestions: [
      {
        question: 'Do we feel safe telling each other the truth — even when it’s uncomfortable?',
        rangeExamples: [
          { label: 'Low', description: 'I often hide things to avoid conflict; we keep the peace by pretending.' },
          { label: 'Medium', description: 'We share most things, but some hard truths feel too risky to say.' },
          { label: 'High', description: 'We can tell each other almost anything, knowing it brings us closer.' }
        ]
      },
      {
        question: 'Are there topics we avoid, minimize, or distort?',
        rangeExamples: [
          { label: 'Low', description: 'Yes, there are many "no-go" zones we silently agree not to touch.' },
          { label: 'Medium', description: 'We have a few sensitive topics we tend to dance around.' },
          { label: 'High', description: 'We face even the hardest topics with openness and courage.' }
        ]
      },
      {
        question: 'When conflict arises, do we seek understanding or validation?',
        rangeExamples: [
          { label: 'Low', description: 'We defend our own positions and try to win the argument.' },
          { label: 'Medium', description: 'We try to listen, but often get stuck in who is "right".' },
          { label: 'High', description: 'We prioritize understanding each other over being right.' }
        ]
      }
    ],
    lastQuestion: {
      question: 'When was the last time you thought about ending this relationship and why didn\'t you?',
      type: 'text'
    },
    actionIdea: 'Choose one area (finances, intimacy, parenting, emotional needs) where you’ll practice “truthful curiosity” this week — not accusations, but gentle inquiry.',
    duoQuestions: [
      'Think about the last time you thought something about your partner but didn’t want to share it? Share it now (partner only listens).',
      'Do we ask questions when we don’t understand each other? Do we listen?',
      'When was the last time you admitted you were wrong?'
    ],
    duoSentence: 'Truth emerges from contrast and perception, not just statements. Silence and observation can be more honest than explanation.'
  },
  {
    id: '2',
    title: 'Flourishing Enablement',
    theme: 'Real growth begins where we are held — and where we learn to hold.',
    description: 'Does the relationship nourish individual and shared growth?',
    goal: 'Explore whether the relationship is a greenhouse or a cage.',
    themeColor: 'green',
    guidingQuestions: [
      {
        question: 'Do I feel more myself, more alive, because of this relationship?',
        rangeExamples: [
          { label: 'Low', description: 'I feel smaller or restricted; I have to hide parts of myself.' },
          { label: 'Medium', description: 'I feel okay, but not particularly energized or expanded.' },
          { label: 'High', description: 'I feel freer and more authentic because of your support.' }
        ]
      },
      {
        question: 'Does my partner encourage my individuality, or feel threatened by it?',
        rangeExamples: [
          { label: 'Low', description: 'My growth or independence often triggers conflict or insecurity.' },
          { label: 'Medium', description: 'They are generally supportive, but can be indifferent to my passions.' },
          { label: 'High', description: 'They are my biggest cheerleader; they love seeing me shine.' }
        ]
      },
      {
        question: 'Do we celebrate each other’s small and large growth moments?',
        rangeExamples: [
          { label: 'Low', description: 'We rarely notice or acknowledge each other’s wins.' },
          { label: 'Medium', description: 'We celebrate the big milestones, but miss the daily growth.' },
          { label: 'High', description: 'We find joy in each other’s progress, big or small.' }
        ]
      }
    ],
    lastQuestion: {
      question: 'Think of a time one of you started something new (project, class, goal). What role did the other person play?',
      type: 'choice',
      options: [
        'Cheered and supported',
        'Didn\'t really engage',
        'Felt threatened or unsupportive'
      ]
    },
    actionIdea: 'Do one small act this week that helps your partner flourish — something that says “I see who you’re becoming.”',
    duoQuestions: [
      'Do we feel emotionally safe and cared for in this relationship?',
      'Do we each feel supported in our goals and passions?',
      'Are we both becoming better, freer versions of ourselves here?',
      'Do we feel we’re allowed to change, grow, and evolve—or do we have to "stay the same"?'
    ],
    duoSentence: 'Growth isn’t a goal; it’s a rhythm between autonomy and nourishment.'
  },
  {
    id: '3',
    title: 'Feedback & Adaptability',
    theme: 'You learn through rhythm — giving, receiving, changing.',
    description: 'Repair, flexibility, learning from conflict.',
    goal: 'Understand how the relationship senses, learns, and evolves.',
    themeColor: 'orange',
    guidingQuestions: [
      {
        question: 'How do we handle mistakes — look for blame or curious to find a fix?',
        rangeExamples: [
          { label: 'Low', description: 'Mistakes lead to blame, shame, or defensiveness.' },
          { label: 'Medium', description: 'We fix the immediate issue but don’t look for the root cause.' },
          { label: 'High', description: 'We view mistakes as opportunities to learn and improve together.' }
        ]
      },
      {
        question: 'Can we repair after a conflict? Is error-correction part of the culture?',
        rangeExamples: [
          { label: 'Low', description: 'We hold grudges; repair is rare or feels forced.' },
          { label: 'Medium', description: 'We eventually move on, but without fully resolving the hurt.' },
          { label: 'High', description: 'We actively repair and reconnect, often becoming stronger.' }
        ]
      },
      {
        question: 'Do we learn from recurring patterns, or repeat them?',
        rangeExamples: [
          { label: 'Low', description: 'We have the same arguments over and over again.' },
          { label: 'Medium', description: 'We try to change, but old habits are hard to break.' },
          { label: 'High', description: 'We spot patterns early and adjust our behavior to shift them.' }
        ]
      },
      {
        question: 'How do we adapt when life circumstances shift (kids, career, illness)?',
        rangeExamples: [
          { label: 'Low', description: 'Change creates chaos and distance between us.' },
          { label: 'Medium', description: 'We cope with change, but it’s stressful and draining.' },
          { label: 'High', description: 'We adapt fluidly, supporting each other through transitions.' }
        ]
      }
    ],
    lastQuestion: {
      question: 'Recall one way you helped your partner change for the better.',
      type: 'text'
    },
    actionIdea: 'Pick one recurring argument and agree to change one small behavior each, then check in after a few days about what shifted.',
    duoQuestions: [
      'Are we able to change patterns or habits that don’t work anymore?',
      'How do we respond to change (moving, new job, loss)?',
      'Do we forgive and move forward after conflicts?',
      'Can you think of a time we surprised each other by being more flexible or understanding than expected?',
      'What’s one pattern we’ve replayed too many times? What’s the lesson we keep missing?'
    ],
    duoSentence: 'Feedback loops are the engine of learning — the capacity for change, repair, and resilience. It ensures life can continue amid entropy and shock.'
  },
  {
    id: '4',
    title: 'Distributed Complexity',
    theme: 'Wholeness repeats across every scale',
    description: 'Balance between individuality and togetherness; structure of the “we.”',
    goal: 'Assess whether the relationship works coherently at different levels — self, couple, family, community.',
    themeColor: 'violet',
    guidingQuestions: [
      {
        question: 'Do we respect each other’s autonomy as well as our interdependence?',
        rangeExamples: [
          { label: 'Low', description: 'One partner dominates or we are overly dependent.' },
          { label: 'Medium', description: 'We struggle to balance "me" time with "we" time.' },
          { label: 'High', description: 'We are strong individuals who choose to be a strong team.' }
        ]
      },
      {
        question: 'Do decisions reflect both of us fairly?',
        rangeExamples: [
          { label: 'Low', description: 'Decisions are usually made by one person or by default.' },
          { label: 'Medium', description: 'Big decisions are shared, but daily ones can be one-sided.' },
          { label: 'High', description: 'We co-create our life; both voices matter equally.' }
        ]
      },
      {
        question: 'Are our shared values reflected in how we treat others (kids, friends, community)?',
        rangeExamples: [
          { label: 'Low', description: 'We act differently at home than we do in public.' },
          { label: 'Medium', description: 'We try to be consistent, but stress makes it hard.' },
          { label: 'High', description: 'Our love ripples out; we treat others with the care we share.' }
        ]
      }
    ],
    lastQuestion: {
      question: 'Think about this week: how did you greet each other most days?',
      type: 'choice',
      options: [
        'With care or affection',
        'With routine, no feeling',
        'Barely noticed each other'
      ]
    },
    actionIdea: 'Map a small “relationship system”: you, your partner, your shared world. Discuss how each circle feeds the others.',
    duoQuestions: [
      'Is there a good balance between “me” and “us”?',
      'Are we becoming more “us” in a way that still respects who we each are?',
      'If this was our last conversion ever- what would you like to tell me and why?',
      'How do decisions happen?',
      'Do we treat each other kindly even in small, everyday moments?',
      'Do we both take responsibility for the health of our relationship?',
      'Where do we need clearer boundaries or stronger unity?'
    ],
    duoSentence: 'The same healthy patterns recur across scales — neurons, individuals, families, communities, nations and nature. Balance between autonomy and unity.'
  },
  {
    id: '5',
    title: 'Temporal Coherence',
    theme: 'Time does not erase — it integrates',
    description: 'Relationship with past, present, and future.',
    goal: 'Understand how memory, healing, and vision help us seize the moment.',
    themeColor: 'gold',
    guidingQuestions: [
      {
        question: 'Do we carry old wounds that still shape how we relate today?',
        rangeExamples: [
          { label: 'Low', description: 'Yes, the past frequently haunts our present interactions.' },
          { label: 'Medium', description: 'Some old hurts linger, but we are working through them.' },
          { label: 'High', description: 'We have healed and learned from our history together.' }
        ]
      },
      {
        question: 'Can we be in the now together — seeing and feeling it freely, without past weight or future fear?',
        rangeExamples: [
          { label: 'Low', description: 'It is hard to relax into the present; old hurts and worries quickly take over.' },
          { label: 'Medium', description: 'We have pockets of ease and enjoyment, but they are often interrupted by tension or overthinking.' },
          { label: 'High', description: 'We can drop into the here-and-now together, feeling light, playful, and free to simply enjoy each other.' }
        ]
      },
      {
        question: 'Do we have a shared future we both feel inspired by?',
        rangeExamples: [
          { label: 'Low', description: 'We rarely talk about the future; we live day-to-day.' },
          { label: 'Medium', description: 'We have vague plans, but lack a concrete shared vision.' },
          { label: 'High', description: 'We are excited to build our next chapter together.' }
        ]
      },
      {
        question: 'Are we living reactively (to past pain) or creatively (toward a vision)?',
        rangeExamples: [
          { label: 'Low', description: 'We are often reacting to triggers and avoiding pain.' },
          { label: 'Medium', description: 'We have moments of vision, but often fall back into reaction.' },
          { label: 'High', description: 'We intentionally create the life and love we want.' }
        ]
      }
    ],
    lastQuestion: {
      question: 'What\'s a relationship behavior you inherited from your parents or childhood?',
      type: 'text'
    },
    actionIdea: 'Sit together without phones and each play three songs that have been meaningful to you; share what each one touches or represents.',
    duoQuestions: [
      'Are we rooted in the present and manage to find moments where we are fully in the now? not trapped by trauma or fear?',
      'Do we move toward the future from internal needs, not external fear?',
      'If i lost my memory, what would be the first thing you would tell me about us?',
      'What experience do we wish we never had?',
      'Do we have rituals that connect our past to our shared future?',
      'If our love was a tree, what roots have we already grown—and where might we still need to plant?',
      'If our relationship was a book, what chapter are we in — and what’s the next one called?'
    ],
    duoSentence: 'Temporal integration happens when the past stops haunting and starts teaching.'
  }
];

export const ONBOARDING_CONTENT = {
  title: "Couples Flourishing",
  subtitle: "The Mirror Awakes",
  body: "Before two people can see each other clearly, each must first look inward.\n\nThis experience is not a test — it’s a reflection.\n\nAnswer honestly. Follow intuition. Each choice shapes what you’ll explore later."
};

export const RESOLUTION_CONTENT = {
  title: "Emergent Directionality",
  body: "Meaning and direction aren’t imposed — they emerge as the field of coherence itself.\nA flourishing system knows where it’s going because it is fully alive."
};
