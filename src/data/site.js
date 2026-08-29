// Everything the page renders lives here — this is the port of renderVals()
// from the design file. Edit copy in this file, not in the components.

export const profile = {
  name: 'Mohammed Alshaqaq',
  role: 'Cloud & Kubernetes Engineer',
  // Placeholder monogram ships with the repo. To use your GitHub photo:
  //   curl -L https://avatars.githubusercontent.com/u/106165079?v=4 -o public/avatar.jpg
  // then change this to '/avatar.jpg'.
  avatar: '/favicon.svg',
  cv: '/cv.pdf',
  email: 'mohmmad521@hotmail.com',
  github: 'https://github.com/CSmohmmadSH',
  linkedin: 'https://www.linkedin.com/in/mohmmad-alshagag/',
  linktree: 'https://linktr.ee/CSmohmmadSH',
};

export const nav = [
  { n: '01', label: 'Work', href: '#work' },
  { n: '02', label: 'Stack', href: '#stack' },
  { n: '03', label: 'About', href: '#about' },
  { n: '04', label: 'Contact', href: '#contact' },
];

export const hero = {
  badge: 'Open to cloud & DevOps roles',
  title: 'Infrastructure that ships itself.',
  body: 'I build and run Kubernetes platforms on AWS — declarative delivery through GitOps, progressive rollouts behind a service mesh, and metrics that turn a release into a decision instead of a guess. Recently completed the SDAIA co-op program on the cloud infrastructure track.',
};

export const highlights = [
  { k: 'Experience', v: 'SDAIA Co-op — cloud infrastructure, completed' },
  { k: 'Core platform', v: 'AWS EKS, Kubernetes, ArgoCD, Istio' },
  { k: 'Learning now', v: 'DevOps concepts and AWS Cloud' },
];

export const flagship = {
  title: 'Task Tracker',
  meta: 'AWS EKS · Kubernetes · Python',
  body: 'A production-grade cloud-native microservices platform on AWS EKS. Deployments are Git-driven and reconciled by ArgoCD, releases shift traffic gradually through an Istio service mesh, and Prometheus and Grafana carry the signal that decides whether a release continues or rolls back.',
  repo: 'https://github.com/CSmohmmadSH/task-tracker',
};

export const pipeline = [
  { n: '01', title: 'Commit', detail: 'Manifests and Helm values live in Git' },
  { n: '02', title: 'Build', detail: 'Container image tagged and scanned' },
  { n: '03', title: 'Sync', detail: 'ArgoCD reconciles the cluster to Git' },
  { n: '04', title: 'Shift', detail: 'Istio moves traffic onto the canary' },
  { n: '05', title: 'Watch', detail: 'Prometheus and Grafana confirm health' },
];

export const platformSpecs = [
  { k: 'Runtime', v: 'AWS EKS' },
  { k: 'Delivery', v: 'GitOps via ArgoCD' },
  { k: 'Release', v: 'Istio canary shifting' },
  { k: 'Observability', v: 'Prometheus + Grafana' },
  { k: 'Services', v: 'Python, containerized' },
];

export const projects = [
  {
    meta: 'Python · FastAPI · Docker',
    title: 'cicd-pipeline-demo',
    body: 'A GitHub Actions pipeline for a containerized FastAPI service: lint, test, SAST and image scanning, then build and push, with Dependabot and branch protection keeping vulnerable dependencies out of the main branch.',
    link: 'https://github.com/CSmohmmadSH/cicd-pipeline-demo-m',
    linkLabel: 'View repository →',
  },
  {
    meta: 'Capstone · Huawei Cloud Stack',
    title: 'Air-gapped GitLab CE',
    body: "Provisioned a VPC, CCE cluster and ARM64 workers on SDAIA's air-gapped Deem cloud, moved a multi-GB arm64 image into the internal registry, and ran GitLab as a StatefulSet with resource limits and readiness probes.",
    link: null,
    linkLabel: 'Internal — not public',
  },
];

export const stackGroups = [
  { label: 'Cloud', items: ['AWS', 'EKS', 'IAM', 'VPC', 'EC2'] },
  { label: 'Orchestration', items: ['Kubernetes', 'Helm', 'Docker', 'Operators'] },
  { label: 'Delivery', items: ['ArgoCD', 'GitOps', 'GitHub Actions', 'Git'] },
  { label: 'Networking', items: ['Istio', 'Service mesh', 'Ingress', 'Canary releases'] },
  { label: 'Observability', items: ['Prometheus', 'Grafana', 'Alerting'] },
  { label: 'Code', items: ['Python', 'FastAPI', 'Bash', 'Linux', 'Java', 'C++'] },
];

export const about = {
  lead: 'I came to infrastructure from writing software, and it stuck — I like the part of the job where a system keeps running without anyone watching it.',
  paragraphs: [
    'My focus is the reliability side: what happens during a rollout, under load, and at 3am. That means declarative infrastructure, rollbacks that are boring, and dashboards nobody has to interpret twice.',
    "I'm looking to collaborate on open-source cloud-native projects, and to learn production SRE practice from people who run clusters for a living. Off the clock, I watch a lot of esports.",
  ],
};

export const facts = [
  { k: 'Experience', v: 'SDAIA Co-op — cloud infrastructure track, completed' },
  { k: 'Ask me about', v: 'Kubernetes, EKS, ArgoCD, Istio, Docker, FastAPI' },
  { k: 'Collaborating on', v: 'Open-source cloud-native and Kubernetes projects' },
  { k: 'Off the clock', v: 'Esports' },
];

export const contact = {
  title: 'Hiring for cloud, DevOps or platform work?',
  body: "I'm open to cloud infrastructure, DevOps and platform engineering roles. Email is the fastest way to reach me.",
};
