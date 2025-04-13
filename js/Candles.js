import {Glow} from "./Glow";

export class Candles
{
    constructor( canvas_manager )
    {
        this.initCandles( canvas_manager );
    }

    initCandles( canvas_manager )
    {
        const w = canvas_manager.width;
        const h = canvas_manager.height;

        this.candles_parameters = [
            { x: 667,  y: 610 , intensity: 100, size: 50 },
            { x: 1636, y: 490 , intensity: 100, size: 50 },
            { x: 2388, y: 652 , intensity: 100, size: 50 },
            { x: 2458, y: 567 , intensity: 100, size: 50 }
        ];

        this.candles = this.candles_parameters.map(param => new Glow(param.x, param.y, param.intensity, param.size));
    }
}