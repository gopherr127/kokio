export interface Project {
  id: string,
  name: string
}

export interface ProjectRelease {
  id: string,
  name: string,
  projectId: string
}