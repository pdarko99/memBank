import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { combineLatest, Subject, throwError } from 'rxjs';
import { catchError, map, startWith, tap } from 'rxjs/operators';
import { MediaService } from '../media/media.service';

@Component({
  selector: 'app-gallary',
  templateUrl: './gallary.page.html',
  styleUrls: ['./gallary.page.scss'],
})
export class GallaryPage implements OnInit {
  search = false

  col = 'All'
  totalPoints = 0
  errormsg = ''
  plainSearch = ''

  User$ = this._ms.getUser().pipe(
    map(x =>{
      x.media.forEach(media => {
        this.totalPoints += media.downloads
      });
      this.totalPoints *= 10
      return x
    }),
    tap(x => console.log(x, 'from users ooooo tom')),
    catchError(err => {
      if(err.message === "Unauthorized"){
        this.errormsg = 'you are not logged In';
      }
      return throwError(err)
    })
  )

  private searchedptn = new Subject<string>();
  insertedSearchedptn$ = this.searchedptn.asObservable();

  allMediaWithSearch$ = combineLatest([
    this.User$.pipe(
      map(x => {
        return x.media
      })
    ),
    this.insertedSearchedptn$.pipe(
      startWith('')
    )
  ]).pipe(
    map(([media, md]) => {
      if(this.plainSearch){
        this.col = 'All'
        return media.filter((i: { description: string; }) => md ?  i.description.includes(md) : true)
      }
      if(md === 'All') return [...media]
      return media.filter((i: { Mediatype: string; }) => md ?  i.Mediatype === md : true)
    })
  )
  constructor(private _ms: MediaService, private _router:Router) { }

  ngOnInit() {
  }

  toggleInput(){
    if(this.search){
      this.col = ''
    }
    this.search = !this.search
  }

  plain(event){
    this.searchedptn.next(this.plainSearch)
  }
  
  fire(data){
    this.col = data
    this.searchedptn.next(data)
  }

  route(data, id){
    data = data.media.filter(x => x.id ===id)[0]
    
    // data.dislikes = data.media[0].dislikes
    this._router.navigateByUrl('/folder/detail', {state: {data, me:true}})

  }

}
