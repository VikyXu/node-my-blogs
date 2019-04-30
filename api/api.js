var express = require('express');
var url = require('url');
var router=express.Router();
var mongoose = require('mongoose');
var Models = require('../model/index')
var session = require('express-session');

mongoose.connect('mongodb://localhost:27017/user', {useNewUrlParser: true});
var app = express();

app.use(session({
    secret: 'VikyWebMyblogs', // 建议使用 128 个字符的随机字符串
    resave: true,
    saveUninitialized: false,
    cookie: { maxAge: 60 * 1000 }
}));
// var admin=new Models.User({
//     name: 'Viky',
//     pwd: 'Viky523186',
//     FirstTitle:[{
//         name: 'ARCHIVE'
//     },{
//         name: 'CSS'
//     },{
//         name: 'JS'
//     },{
//         name: 'NODE'
//     },{
//         name: 'REACT'
//     }]
// })
// admin.save(function(err,ret){
//     if(err){
//         console.log('保存失败')
//     }else{
//         console.log('保存成功')
//         console.log(ret)
//     }
// })
// Models.User.findOne({ name: 'Viky' }, function (err, doc) {
//     if (err){return err}else{
//         // console.log(doc.pwd)
//         doc.pwd='Viky123456'
//         doc.save(
//             function(err,ret){
//                     if(err){
//                         console.log(err)
//                     }else{
//                         console.log('保存成功')
//                         console.log(ret)
//                     }
//                 }
//         );
//     }
//     // doc.name = 'jason bourne';
//     // doc.save(callback);
//   })

// const SecondTitle =new Models.SecondTitle({
//     class_id: '5cbdff5dfc54490448c21f69',
//     title: '啦啦啦',
//     FirstTitle: 'JS',
//     readNumber: 20,
//     content: '呦呦呦切克闹'
// });
// SecondTitle.save(function(err,ret){
//     if(err){
//         console.log('保存失败')
//     }else{
//         console.log('保存成功')
//     }
// })
// Models.User.find(function(err,ret){
//     if(err){
//         console.log(err)
//     }else{
//         console.log(ret[0].FirstTitle)
//     }
// })
// Models.SecondTitle.find(function(err,ret){
//     if(err){
//         console.log('查询失败')
//     }else{
//         console.log(ret)
//     }
// })

//登录验证
var userIsRight = function(username,password){
    return new Promise(function(resolve,reject){
        Models.User.findOne({
            name:username
        },function(err,result){
            // if(result.length==0){
            //     reject("用户名错误")
            // }else if(result[0].pwd==password){
            //     var userInfo={
            //         name:username,
            //         id:result[0]._id
            //     }
            //     resolve(JSON.stringify(userInfo));
            // }else {
            //     reject('密码错误');
            // }
            // if(result.length==0){
            //     console.log('用户不存在')
            // }
            if(result===null){
                reject("用户名错误")
            }else{
                result.comparePassword(password,function(err, isMatch){
                    if (err) {
                        reject(err)
                    }
                    if ((password, isMatch) == true) {
                        var userInfo={
                                name:username,
                                id:result._id
                            }
                        resolve(JSON.stringify(userInfo))
                      } else {
                        reject("用户名或者密码错误")
                      }
                })
            }
        })
    })
}

// 获取所有一级标题api
var getFirstTitle = function(firstTitleArray){
    return new Promise(function(resolve,reject){
        Models.User.find(function(err,ret){
            if(err){
                reject('查询失败')
            }else{
                var data = ret[0].FirstTitle
                resolve(data)
            }
        })
    })
}
// 根据一级分类获取所有二级标题api
var getSecondTitle = function(firstTitleItem){
    return new Promise(function(resolve,reject){
        Models.SecondTitle.find({
            class_id: firstTitleItem._id
        },function(err,ret){
            if(err){
                reject('查询失败')
            }else{
                resolve(ret)
            }
        })
    })
}
// 根据一级分类ID获取所有对应二级内容api
var getSecondTitleById = function(firstTitleId){
    return new Promise(function(resolve,reject){
        Models.SecondTitle.find({
            class_id: firstTitleId
        },function(err,ret){
            if(err){
                reject('查询失败')
            }else{
                resolve(ret)
            }
        })
    })
}
// 根据二级ID获取对应ID具体内容api
var getSecondContent = function(SecondTitleId){
    return new Promise(function(resolve,reject){
        Models.SecondTitle.find({
            _id: SecondTitleId
        },function(err,ret){
            if(err){
                reject('查询失败')
            }else{
                resolve(ret)
            }
        })
    })
}
// manage接口
// 返回所有一级标题和id，每个一级标题下二级标题和id
const allTitleId =function(firstTitleArray){
    return new Promise(function(resolve,reject){
        let secondArr=[],
        secondObj={},
        itemObj={},
        dataArray=[];
        (function secondTitleloop(index){
            getSecondTitle(firstTitleArray[index]).then(function(ret){
                secondArr=[];
                ret.forEach((item2)=>{
                    secondObj={};
                    secondObj['_id'] = String(item2._id);
                    secondObj['title'] = item2.title;
                    secondArr.push(secondObj)
                })
                itemObj = JSON.parse(JSON.stringify(firstTitleArray[index]));
                itemObj['secondTitle']= secondArr;
                dataArray.push(itemObj)
                if (++index<firstTitleArray.length) {
                    secondTitleloop(index);
                } else {
                    resolve(dataArray)
                }
            }).catch(function(err){
                reject(err)
            })
        }
        )(0)
    })
}

// //根据一级分类筛选当前对应的二级标题和id
// const getSecondContent = function(SecondId){
//     return new Promise(function(resolve,reject){
//         getSecondTitleById(firstTitleId).then(function(data){
//             console.log(data)
//             resolve(data)
//         }).catch(function(err){
//             reject(err)
//         })
//     })
// }

//根据一级分类筛选当前对应的二级标题和id
const firstTitleToSecond = function(firstTitleId){
    return new Promise(function(resolve,reject){
        getSecondTitleById(firstTitleId).then(function(data){
            let secondObj = {},
                secondArr = [];
            data.forEach(function(item){
                secondObj={};
                secondObj['_id'] = String(item._id);
                secondObj['title'] = item.title;
                secondArr.push(secondObj)
            })
            resolve(secondArr)
        }).catch(function(err){
            reject(err)
        })
    })
}

router.get('/test',function(request,response){
    request.session.user = data
})

router.post('/login',function(request,response){
    var username = request.body.username;
    var password = request.body.password;
    userIsRight(username,password).then(function(data){
        // 此处写入的session 
        request.session.user = data
        response.send(data)
        // response.send(data)
    }).catch(function(err){
        response.send(err)
    })
})

router.get('/manage',function(requset,response){
    console.log(requset.session.user)
    getFirstTitle().then(function(data){
        // return allTitleId(data)
        response.send(data)
    }).catch(function(){
        response.send(err)
    })
})

//根据一级分类筛选当前对应的二级标题和id
router.get('/manage/notebooks',function(requset,response){
    var params = url.parse(requset.url, true).query;  
    console.log(params.notebooks)
    firstTitleToSecond(params.notebooks).then(function(data){
        response.send(data)
    }).catch(function(err){
        response.send(err)
    })
})

//根据二级ID刷选具体内容
router.get('/manage/notes',function(requset,response){
    var params = url.parse(requset.url, true).query;  
    console.log(params.notes)
    getSecondContent(params.notes).then(function(data){
        response.send(data)
    }).catch(function(err){
        response.send(err)
    })
})


module.exports=router;