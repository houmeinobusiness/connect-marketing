export interface Project {
  title: string;
  kind: 'client' | 'demo';
  description: string;
  url: string;
  approvedForPublication: boolean;
  completed: boolean;
}
// Only completed projects explicitly approved for publication may be rendered.
export const projects: Project[] = [];
export const publishedProjects = projects.filter(p => p.completed && p.approvedForPublication);
