const PriorityQueue = require('js-priority-queue')
let fx = [0, 1, 0, -1];
let fy = [1, 0, -1, 0];
var par = []

///manhattan distance
function h(source,destination)
{
    let x = Math.abs(source[0]-destination[0]);
    let y = Math.abs(source[1]-destination[1]);
    return x+y;
}
function get_path(source,destination){
    let path = [];
    console.log('source ',source,' destination',destination);
    let x=destination[0],y = destination[1];
    let temp = 400 
    while(temp--){
        path.push([x,y]);
        let tp = par[x][y];
        // console.log("inside while in A*",x,y,tp);
        x = tp[0];
        y = tp[1];
        if(x === source[0] && y === source[1])break;
    }
    path.push([x,y]);
    path.reverse();
    return path;
}
/*
computes shortest path from source to destination on a given 2d map and 
then returns a path starting from the source.
*/
function shortest_path(source,destination,map){
    // console.log('shortest path ',source,destination);
    let temp=source[0]
    source[0]=source[1]
    source[1]=temp
    temp = destination[0]
    destination[0]=destination[1]
    destination[1] = temp
    console.log('src,dest',source,destination)
    let n = map.length+4,m=map[0].length+4;
    const inf = 1000000000;
    var queue = new PriorityQueue({
        comparator: function(a1, a2) {
            return a1[0] - a2[0];
        }
    });
    let g = new Array(n);
    for(let i=0;i<n;i++)g[i] = new Array(m).fill(inf)
    
    let f = new Array(n);
    for(let i=0;i<n;i++)f[i] = new Array(m).fill(inf)

    let closed = new Array(n);
    for(let i=0;i<n;i++)closed[i] = new Array(m).fill(0);

    par = new Array(n);
    for(let i=0;i<n;i++){
        par[i] = new Array(m)
        for(let j=0;j<m;j++)par[i][j] = new Array(3).fill(0);
    }
    let source_h = h(source,destination)
    queue.queue([source_h,source]);
    f[source] = source_h;
    g[source[0]][source[1]] = 0;
    while(queue.length>0){
        let top = queue.dequeue();
        if(top[1] === destination)
        {
            console.log("destination reached!");
            break;
        }
        let x = top[1][0],y=top[1][1];
        if(closed[x][y])continue;
        closed[x][y]=true;
        // console.log('top = ',top)
        for(let k=0;k<4;k++){
            let xx = x + fx[k];
            let yy = y + fy[k];
            if(xx<0||yy<0||xx>=n||yy>=m)continue;
            if(map[xx][yy] !== 1){     /// walkable cell
                // console.log('xx,yy = ',xx,yy,g[x][y],h([xx,yy],destination));
                let cur_f = g[x][y] + h([xx,yy],destination) + 1;
                if(cur_f < f[xx][yy]){
                    f[xx][yy] = cur_f;
                    g[xx][yy] = g[x][y] + 1;
                    queue.queue([f[xx][yy],[xx,yy]]);
                    par[xx][yy] = [x,y]
                }
            }
        }
        // console.log('queue.length ',queue.length)
    }
    // console.log('n,m',n,m);
    // for(let i=0;i<n;i++){
    //     for(let j=0;j<m;j++){
    //         if(g[i][j]!=inf){
    //             console.log('i,j -> ',i,j,'  g ',g[i][j])
    //         }
    //         console.log('i,j -> ',i,j,' par: ',par[i][j]);
    //     }
    // }
    
    let path =  get_path(source,destination);
    // console.log('path = ',path);
    return path;
}


// let t_map = [
//     [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],    
//     [1,4,0,7,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
//     [1,0,1,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,1],
//     [1,0,1,0,0,1,1,1,1,1,0,0,0,1,0,0,0,0,1],
//     [1,0,1,1,1,7,0,0,0,1,0,0,0,1,0,0,0,0,1],
//     [1,0,0,0,1,6,0,0,0,1,0,0,0,1,0,0,0,0,1],
//     [1,0,0,0,1,0,0,0,0,1,0,0,0,1,1,1,0,0,1],
//     [1,0,0,0,1,1,0,0,0,1,0,0,0,1,0,0,0,6,1],
//     [1,0,0,0,1,0,0,1,6,0,0,0,0,0,0,0,0,0,1],
//     [1,0,0,0,1,0,0,1,0,1,1,1,1,1,1,1,0,0,1],
//     [1,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,1],
//     [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
// ]

// let res = shortest_path([9,8],[11,1],t_map)
// console.log(res)
// module.exports = shortest_path;
export default shortest_path;