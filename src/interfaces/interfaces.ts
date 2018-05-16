export interface Project {
  id: string,
  name: string
}

export interface Release {
  id: string,
  name: string,
  projectId: string,
  project: Project
}