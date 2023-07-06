import gql from 'graphql-tag.macro';

export const listProjects = gql`
  query listProjects {
    listProjects @rest(type: "[Projects]", path: "/v1/project") {
      id
      code
      name
      acronym
      address
      unitNumber
      streetNumber
      streetName
      city
      province
      postalCode
      country
      dateStarted
      dateCompleted
      status
    }
  }
`;

export const listAllProjects = gql`
  query listAllProjects {
    listAllProjects @rest(type: "[Projects]", path: "/v1/project/all/projects") {
      id
      code
      name
      acronym
      address
      unitNumber
      streetNumber
      streetName
      city
      province
      postalCode
      country
      dateStarted
      dateCompleted
      status
    }
  }
`;

export const listArchiveProjects = gql`
  query listArchiveProjects {
    listArchiveProjects @rest(type: "[Projects]", path: "/v1/project/archived/projects") {
      id
      code
      name
      acronym
      address
      unitNumber
      streetNumber
      streetName
      city
      province
      postalCode
      country
      dateStarted
      dateCompleted
      status
    }
  }
`;

export const listProjectSummary = gql`
  query listProjectSummary($projectId: Number!) {
    listProjectSummary(projectId: $projectId)
      @rest(type: "[ProjectSummary]", path: "/v1/project/{args.projectId}") {
      minutes
      submittals
      rfis
      sis
      project
    }
  }
`;

export const createProject = gql`
  mutation createProject($input: Project) {
    createProject(input: $input)
      @rest(type: "Project", path: "/v1/project", method: "POST") {
      id
      code
      name
      acronym
      address
      unitNumber
      streetNumber
      streetName
      city
      province
      postalCode
      country
      dateStarted
      dateCompleted
      status
    }
  }
`;

export const updateProject = gql`
  mutation createProject($input: Project, $projectId: Number!) {
    createProject(input: $input, projectId: $projectId)
      @rest(
        type: "Project"
        path: "/v1/project/{args.projectId}"
        method: "PATCH"
      ) {
      id
      code
      name
      acronym
      address
      unitNumber
      streetNumber
      streetName
      city
      province
      postalCode
      country
      dateStarted
      dateCompleted
      status
    }
  }
`;

/*update meeting */
export const updateMeetingSeries = gql`
  mutation createMeetingSeries($input: MeetingSeries, $rowDataId: Number!) {
    createMeetingSeries(input: $input, rowDataId: $rowDataId)
    @rest(
      type: "MeetingSeries"
      path: "/v1/mm/meeting-group/{args.rowDataId}"
      method: "PATCH"
    ) {
      id
      attendees
      latestMeetingId
      meetingNumber
      minutesSent
      name
      observer
      openItems
      reviewSent
      startTime
    }
  }
`;

export const archiveProject = gql`
  mutation createProject($input: Project, $projectId: Number!) {
    createProject(input: $input, projectId: $projectId)
      @rest(
        type: "Project"
        path: "/v1/project/{args.projectId}/archive"
        method: "PATCH"
      ) {
      id
    }
  }
`;

export const restoreProject = gql`
  mutation createProject($input: Project, $projectId: Number!) {
    createProject(input: $input, projectId: $projectId)
      @rest(
        type: "Project"
        path: "/v1/project/{args.projectId}/restore"
        method: "PATCH"
      ) {
      id
    }
  }
`;