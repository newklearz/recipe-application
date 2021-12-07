import {Injectable} from "@angular/core";
import {HttpClient, HttpParams} from "@angular/common/http";
import {RecipeService} from "../recipes/recipe.service";
import {Recipe} from "../recipes/recipe.model";
import {exhaustMap, map, take, tap} from "rxjs/operators";
import {AuthService} from "../auth/auth.service";

@Injectable({providedIn: 'root'})
export class DataStorageService {
  constructor(private httpClient: HttpClient,
              private recipeService: RecipeService,
              private authService: AuthService) {

  }

  storeRecipes() {
    const recipes = this.recipeService.getRecipes();
    this.httpClient.put('https://my-recipe-application-33437-default-rtdb.firebaseio.com/recipes.json', recipes)
      .subscribe(response => {
        console.log(response);
      });
  }

  // fetchRecipes() {
  //   return this.authService.user.pipe(take(1), exhaustMap(user => {
  //       return this.httpClient.get<Recipe[]>('https://my-recipe-application-33437-default-rtdb.firebaseio.com/recipes.json',
  //         {
  //           params: new HttpParams().set('auth', user.token)
  //         })
  //     }), map(recipes => {
  //       return recipes.map(recipe => {
  //         return {...recipe, ingredients: recipe.ingredients ? recipe.ingredients : []}
  //       })
  //     }), tap(recipes => this.recipeService.setRecipes(recipes))
  //   );
  // }

  fetchRecipes() {
    return this.httpClient.get<Recipe[]>('https://my-recipe-application-33437-default-rtdb.firebaseio.com/recipes.json',
    ).pipe(
      map(recipes => {
        return recipes.map(recipe => {
          return {...recipe, ingredients: recipe.ingredients ? recipe.ingredients : []}
        })
      }), tap(recipes => this.recipeService.setRecipes(recipes))
    );
  }
}
