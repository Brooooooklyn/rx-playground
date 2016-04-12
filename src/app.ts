'use strict'
import * as Rx from 'rxjs'
import {apiHost} from './config/config'
import {
  Utils,
  UserFetch,
  ProjectFetch,
  Fetch,
  UserMe,
  ProjectData,
  MemberFetch,
  MemberData
} from 'teambition-sdk'

const token = require('../auth').token

Fetch.setToken(token)
Fetch.setAPIHost(apiHost)

const user = new UserFetch()
const project = new ProjectFetch()
const member = new MemberFetch()

const userMe: () => Rx.Observable<UserMe> = () => {
  return Rx.Observable
    .fromPromise<UserMe>(user.getUserMe())
}

const projects: () => Rx.Observable<ProjectData[]> = () => {
  return Rx.Observable
    .fromPromise<ProjectData[]>(project.getAll())
}

const memberData = (_id: string): Rx.Observable<MemberData[]> => {
  return Rx.Observable
    .fromPromise<MemberData[]>(member.getProjectMembers(_id))
}

const memberDatas = (_ids: string []): Rx.Observable<MemberData[]> => {
  return Rx.Observable
    .from<Rx.Observable<MemberData[]>>(_ids.map(i => memberData(i)))
    .concatAll()
}

function catchFromObservable (err: Error, source: Rx.Observable<any>) {
  console.error(err)
  return Rx.Observable.empty()
}

projects().withLatestFrom(userMe())
  .map(x => x[0].map(y => y._id))
  .flatMap(i => memberDatas(i))
  .catch(catchFromObservable)
  .subscribe(r => console.log(r))
