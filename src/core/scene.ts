/**
 * Scene interface
 * 
 * (c) 2018 Jani Nykänen
 */

// Scene interface
interface Scene {

    init(ass : Assets): any
    update(tm: number): any
    draw(g : Graphics) : any
    changeTo?(): any

    getName(): string
}
