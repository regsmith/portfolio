const benchmark = {
  stage: 'Windows SonarQube stage',
  before: '45-60',
  after: '4-10',
  unit: 'minutes',
  context: 'Approximate timings, same code.',
  caveat: 'Stage-level improvement, not the whole pipeline.',
};

export const resume = {
  name: 'Reginald Smith',
  headline: 'Senior software & security engineering',
  introduction: "I've grown from manual test verification to developing full automation suites and into a technical and team leader.",
  linkedin: 'https://www.linkedin.com/in/reg-smith-b877913a/',
  employer: 'Cisco',
  title: 'Software Developer',
  tenure: 'January 2014 - present',
  startDate: '2014-01',
  grade: 'Current grade: 10',
  benchmark,
  phases: [
    { name: 'Technical lead', dates: '2018 - present' },
    { name: 'Team lead', dates: '2020 - present' },
    { name: 'People manager', dates: '2024 - 2026' },
  ],
  management: 'Managed 3 employees through monthly check-ins, performance reviews, coaching and training recommendations.',
  certification: {
    name: 'Scrum Master certification',
    date: 'July 2021',
    activities: 'Facilitated Scrum ceremonies, story-point estimation, retrospectives, sprint reviews and refinement.',
  },
  careerHighlights: [
    {
      dates: 'September 2026',
      text: 'Separated component tests and SonarQube from the multi-stage CI pipeline into independently rerunnable downstream jobs. S3 artifact handoffs avoided rebuilding for analysis reruns; the Windows SonarQube stage dropped from approximately 45–60 minutes to 4–10 minutes, reducing false negatives and full-PR reruns.',
    },
    {
      dates: 'August 2025 - present',
      text: 'Led, designed and built cross-platform build infrastructure for Cisco Endpoint DLP in Cisco Secure Client across Windows, macOS and Linux, with signing and compliance controls that prevent unsigned builds from reaching customers.',
    },
    {
      dates: '2022 - August 2025',
      text: 'Led the Secure Endpoint macOS/Linux build infrastructure move from vSphere to AWS ephemeral build nodes. Created Ansible roles for verified dependencies and CIS-hardened AMI rollouts, and organized Jenkins CI work with signing and compliance controls that kept unsigned builds from reaching customers.',
    },
    {
      dates: '2015 - August 2025',
      text: 'Built Ruby/RSpec automation for Secure Endpoint on macOS and Linux, installing the product and running regression scenarios to verify expected detection and quarantine behavior. The automation project continued after my contribution ended.',
    },
  ],
  work: [
    {
      id: 'pipeline',
      category: 'CI optimization',
      dates: 'September 2026',
      title: 'Rerun the analysis. Not the build.',
      summary: 'Made CI feedback more focused and recoverable for Cisco Endpoint DLP in Cisco Secure Client.',
      bullets: [
        'Extracted component tests and SonarQube from a multi-stage pipeline into separately rerunnable downstream jobs, preserving the successful build stage.',
        'Used S3 artifact handoffs so analysis reruns did not require a rebuild, reducing false negatives and full-PR reruns.',
        `Reduced the ${benchmark.stage} from approximately ${benchmark.before} ${benchmark.unit} to ${benchmark.after} ${benchmark.unit} on the same code. This benchmark is for the SonarQube stage, not the entire pipeline.`,
      ],
      tags: ['Jenkins', 'SonarQube', 'S3', 'CI/CD'],
    },
    {
      id: 'dlp',
      category: 'Build & release infrastructure',
      dates: 'August 2025 - present',
      title: 'A dependable path to delivery.',
      summary: 'Led, designed and hands-on built infrastructure for Cisco Endpoint DLP in Cisco Secure Client across Windows, macOS and Linux.',
      bullets: [
        'Built corresponding cross-platform build and release infrastructure with signing and compliance enforcement to prevent unsigned builds from reaching customers.',
      ],
      tags: ['Windows', 'macOS', 'Linux', 'Signing & compliance'],
    },
    {
      id: 'cloud',
      category: 'Cloud migration',
      dates: '2022 - August 2025',
      title: 'Short-lived builds. Lasting guardrails.',
      summary: 'Led and organized the Secure Endpoint AWS infrastructure and build compliance work, migrating Mac/Linux vSphere build infrastructure to AWS ephemeral build nodes.',
      bullets: [
        'Used Ansible roles for verified dependencies, including CMake, CIS-hardened AMI rollouts and Jenkins CI.',
        'Enforced signing and compliance safeguards that prevented unsigned builds from reaching customers.',
      ],
      tags: ['AWS', 'vSphere', 'Ansible', 'Jenkins'],
    },
    {
      id: 'quality',
      category: 'QA automation',
      dates: '2015 - August 2025',
      title: 'Confidence, built into the regression.',
      summary: 'Contributed to Secure Endpoint Mac/Linux QA automation using Ruby and RSpec.',
      bullets: [
        'Automated product installation and regression testing of expected detection, quarantine and metadata behavior.',
        'My contribution ended in August 2025; the automation project continued afterward.',
      ],
      tags: ['Ruby', 'RSpec', 'QA automation', 'Mac / Linux'],
    },
  ],
  skills: [
    { name: 'Cloud & delivery', items: ['AWS', 'vSphere', 'Terraform', 'Jenkins', 'Ansible', 'CI/CD', 'Build/release infrastructure'] },
    { name: 'Code & quality', items: ['Ruby', 'RSpec', 'Python', 'Shell', 'Git', 'QA automation', 'Windows / macOS / Linux'] },
    { name: 'AI-assisted development', items: ['Spec-driven development and multi-agent feature delivery'] },
    { name: 'People & practice', items: ['Technical leadership', 'Team leadership', 'People management', 'Scrum facilitation'] },
  ],
  approach: [
    { title: 'Keep useful work.', text: 'I look for the actual constraint. Separating analysis from successful builds made the DLP pipeline easier to rerun without throwing away good work.' },
    { title: 'Make trust repeatable.', text: 'I put quality and release safeguards into the workflow, from Ruby/RSpec regression testing to enforced build signing and compliance.' },
    { title: 'Stay close to people.', text: 'I combine hands-on engineering with team leadership. As a people manager, I used regular check-ins, coaching and training recommendations to support growth.' },
  ],
  education: { institution: 'University of Calgary', qualification: "Bachelor's degree in Software Engineering", year: '2013' },
  personal: [
    {
      category: 'Personal project',
      title: 'LCI Fantasy',
      dates: 'Early 2021 - present',
      text: 'I built a fantasy football league-history website with Jekyll, Markdown and custom HTML/CSS in early 2021. Recent AI-assisted additions include public payment-tracking and mock-draft features. I enjoy turning a shared interest into something useful for the league.',
      links: [{ label: 'Visit LCI Fantasy', url: 'https://lcifantasy.ca/' }],
    },
    {
      category: 'Beyond the keyboard',
      title: 'Songs, stages & a little volume.',
      dates: 'Jenavive 2008 - 2015 / The Jingles 2015 - 2017',
      text: "Music has been a big part of my life: songwriting, electric guitar and bass, North American live shows, studio recording and rehearsal. I've made music with Jenavive and The Jingles.",
      links: [
        { label: 'Jenavive on Bandcamp', url: 'https://jenavive.bandcamp.com/album/jenavive' },
        { label: 'The Jingles on Bandcamp', url: 'https://thejingles.bandcamp.com/music' },
      ],
    },
  ],
};
