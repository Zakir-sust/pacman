
// 0 : dots 
// 1 : wall
// 4 : Pacman
// 5 : empty
// 6 : enemy
// 7 : power dot
var ara = [[
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],    
        [1,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,6,1],
        [1,0,0,0,0,0,0,7,0,0,0,0,0,1,1,1,1,0,1],
        [1,0,1,0,0,0,1,1,1,1,0,0,0,1,0,0,0,0,1],
        [1,0,1,1,1,7,0,0,0,1,0,0,0,1,0,0,0,0,1],
        [1,0,1,0,1,0,0,0,0,1,0,1,0,1,0,1,0,0,1],
        [1,0,1,0,1,0,0,0,6,1,0,1,0,1,1,1,0,0,1],
        [1,0,0,0,1,1,0,0,0,1,0,1,0,1,0,0,0,6,1],
        [1,0,0,0,1,0,0,1,0,0,0,0,0,0,0,1,0,0,1],
        [1,0,0,0,1,0,0,1,0,1,1,1,1,1,1,1,0,0,1],
        [1,6,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,1],
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    ],
    [
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],    
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,1,0,0,0,0,1,1,1,0,1,1,1,1,1,0,0,1],
        [1,0,1,0,0,1,0,1,1,0,0,0,0,1,0,4,0,0,1],
        [1,0,1,1,0,7,0,1,1,0,0,1,0,1,0,0,0,0,1],
        [1,0,0,0,1,0,0,1,0,0,0,1,0,1,0,0,0,0,1],
        [1,0,0,0,1,0,0,0,0,0,0,1,0,0,0,1,1,0,1],
        [1,0,0,0,1,0,0,1,0,1,1,1,1,1,1,1,0,0,1],
        [1,0,0,7,1,1,0,0,0,0,0,0,0,1,0,0,0,6,1],
        [1,1,1,0,1,0,0,1,0,0,0,1,1,0,0,0,0,0,1],
        [1,6,0,0,0,6,0,1,0,0,0,0,1,0,6,0,0,0,1],
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    ],
    [
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],    
        [1,0,0,0,1,1,0,0,0,0,0,0,0,0,6,0,0,0,1],
        [1,0,1,0,0,0,0,0,0,0,0,1,1,1,1,1,0,0,1],
        [1,0,1,0,0,1,0,0,0,1,0,0,0,1,0,4,0,0,1],
        [1,0,1,1,0,1,4,0,0,1,0,1,0,1,0,0,0,0,1],
        [1,0,0,0,1,1,1,0,0,1,0,1,0,1,0,1,1,0,1],
        [1,0,0,0,1,0,1,0,0,1,0,1,0,0,0,1,1,0,1],
        [1,0,0,7,1,1,0,0,0,1,0,0,0,1,0,0,0,6,1],
        [1,1,1,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,1,0,0,1,1,1,1,0,1,1,1,1,0,0,1],
        [1,6,0,0,0,6,0,1,0,0,0,0,0,0,6,1,0,0,1],
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    ],
]
export default ara;