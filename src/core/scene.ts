/**
 * Scene interface
 * 
 * (c) 2018 Jani Nykänen
 */

// Scene interface
interface Scene {

    init(): any
    update(tm: number): any
    draw(g : Graphics) : any
    changeTo?(): any

    getName(): string
}
