var express = require("express");
var mysql2 = require("mysql2");
var fileuploader = require("express-fileupload");

/*const nodemailer=require('nodemailer');
require("dotenv").config();
const html=`
<h1>Hello World</h1>
<p>isnt nodemailer useful</p>
`;
const transporter = nodemailer.createTransport({
    service:'gmail',
    host: "smtp.ethereal.email",
    port: 587,
    secure: false, // Use `true` for port 465, `false` for all other ports
    auth: {
      user: process.env.user,
      pass: process.env.app_pwd,
    },
  });
  const info = {
    from: {
        name:'EventVerse',
        address: process.env.user,
    }, // sender address
    to: "singhal123muskaan@gmail.com",// list of receivers
    subject: "Hello ✔", // Subject line
    text: "Hello world?", // plain text body
    html: "<b>Hello world?</b>", // html body
  };
  const sendMail=async(transporter,info)=>{
    try{
        await transporter.sendMail(info);
        console.log("email has been sent successfully");
    }
    catch(error)
    {
        console.error(error);
    }
  }
  sendMail(transporter,info);*/

let app = express();
app.listen(2005, function () {
    console.log("server 2005 started");
})
app.use(express.static("public"));
app.use(express.urlencoded("true"));
app.use(fileuploader());

let config = {
    host: "b6oblrhco0upbtzqofkj-mysql.services.clever-cloud.com",
    user: "ukazvosvnihr4pff",
    password: "M9RFIaKGUPXEUICkSw5g",
    database: "b6oblrhco0upbtzqofkj",
    dateStrings: true,
    keepAliveInitialDelay: 10000,
    enableKeepAlive: true,
}
var mysql = mysql2.createConnection(config);
mysql.connect(function (err) {
    if (err == null) {
        console.log("connected to database");
    }
    else {
        console.log(err.message);
    }
})

app.get("/", function (req, resp) {
    let path = __dirname + "/index.html/";
    resp.sendFile(path);
})
app.get("/signup-process", function (req, resp) {
    console.log(req.query);

    let email = req.query.txtEmail;
    let pwd = req.query.pwd;
    let utype = req.query.combo;

    mysql.query("insert into users(email,pwd,utype) values(?,?,?)", [email, pwd, utype], function (err) {
        if (err == null) {
            resp.send("Signed Up Successfullyy")
        }
        else
            resp.send(err.message);
    })
})

app.get("/login-process", function (req, resp) {
    //console.log("login-process");
    let emaill = req.query.txtEmaill;
    let txtPwd = req.query.txtPwd;
    mysql.query("select * from users where email=? and pwd=?", [emaill, txtPwd], function (err, result) {
        if (err != null) {
            resp.send(err.message); return;
        }
        if (result.length == 0) {
            resp.send("Invalid Id or Password"); return;
        }
        if (result[0].status == 1) {
            resp.send(result[0].utype); return;
        }
        else {
            resp.send("U R Blocked!!!"); return;
        }

    })

})
app.get("/dash", function (req, resp) {
    let path = __dirname + "/public/infl-dash.html";
    resp.sendFile(path);
})
app.get("/profile", function (req, resp) {
    let path = __dirname + "/public/infl-profile.html";
    resp.sendFile(path);
})
app.post("/save-process", function (req, resp) {
    let emailid = req.body.inputEmail4;
    let iname = req.body.txtname;
    let gender = req.body.combog;
    let dob = req.body.inputdob;
    let address = req.body.inputAddress2;
    let city = req.body.comboc;
    let contact = req.body.inputcontact;
    let fields = req.body.combof;
    let insta = req.body.insta;
    let fb = req.body.fb;
    let youtube = req.body.youtube;
    let other = req.body.other;
    let filen = "";
    if (req.files != null) {
        filen = req.files.ppic.name;
        let path = __dirname + "/public/uploads/" + filen;
        req.files.ppic.mv(path);
    }
    else {
        filen = "nopic.jpg";
    }
    mysql.query("insert into iprofile values(?,?,?,?,?,?,?,?,?,?,?,?,?)", [emailid, iname, gender, dob, address, city, contact, fields, insta, fb, youtube, other, filen], function (err, result) {
        if (err == null) {
            resp.redirect("result.html");
        }
        else
            resp.send(err.message);
    })
})
app.get("/find-user", function (req, resp) {
    let email = req.query.inputEmail4;
    mysql.query("select * from iprofile where emailid=?", [email], function (err, result) {
        if (err != null) {
            resp.send(err.message);
            return;
        }
        console.log(result);
        resp.send(result);
    })
})
app.post("/update-process", function (req, resp) {
    console.log(req.body);
    let filen = "";
    if (req.files != null) {
        filen = req.files.ppic.name;
        let path = __dirname + "/public/uploads/" + filen;
        req.files.ppic.mv(path);
    }
    else {
        filen = req.body.hdn;
    }
    let emailid = req.body.inputEmail4;
    let iname = req.body.txtname;
    let gender = req.body.combog;
    let dob = req.body.inputdob;
    let address = req.body.inputAddress2;
    let city = req.body.comboc;
    let contact = req.body.inputcontact;
    let fields = req.body.combof;
    let insta = req.body.insta;
    let fb = req.body.fb;
    let youtube = req.body.youtube;
    let other = req.body.other;
    mysql.query("update iprofile set iname=?,gender=?,dob=?,address=?,city=?,contact=?,fields=?,insta=?,fb=?,youtube=?,others=?,picpath=? where emailid=?", [iname, gender, dob, address, city, contact, fields, insta, fb, youtube, other, filen, emailid], function (err, result) {
        if (err == null) {
            if (result.affectedRows >= 1) {
                resp.redirect("result.html");
            }
            else {
                resp.send("invalid email id");
            }
        }
        else {
            resp.send(err.message);
        }
    })
})
app.post("/post-event", function (req, resp) {
    emailid = req.body.bemail;
    events = req.body.bevent;
    doe = req.body.bdate;
    tos = req.body.btime;
    city = req.body.bcity;
    venue = req.body.bvenue;
    mysql.query("insert into events values (?,?,?,?,?,?)", [emailid, events, doe, tos, city, venue], function (err, result) {
        if (err == null) {
            resp.send("saved events");
        }
        else {
            resp.send(err.message);
        }
    })
})
app.post("/update-pwd", function (req, resp) {
    let semail = req.body.semail;
    let sopwd = req.body.sopwd;
    let snpwd = req.body.snpwd;
    let srpwd = req.body.srpwd;

    if (snpwd !== srpwd) {
        resp.send("The new password does not match the confirmed password");
    } else {
        mysql.query("SELECT * FROM users WHERE email = ? AND pwd = ?", [semail, sopwd], function (err, result) {
            if (err) {
                resp.send(err.message);
            } else if (result.length === 0) {
                resp.send("Invalid email or old password");
            } else {
                mysql.query("UPDATE users SET pwd = ? WHERE email = ?", [snpwd, semail], function (err, result) {
                    if (err) {
                        resp.send(err.message);
                    } else if (result.affectedRows > 0) {
                        resp.send("Password updated successfully");
                    } else {
                        resp.send("Failed to update password");
                    }
                });
            }
        });
    }
});

app.get("/infl-dash", function (req, resp) {
    let path = __dirname + "/public/infl-dash.html";
    resp.sendFile(path);
})
app.get("/admin-dash", function (req, resp) {
    let path = __dirname + "/public/admin-dash.html";
    resp.sendFile(path);
})
app.get("/admin-users", function (req, resp) {
    let path = __dirname + "/public/admin-users.html";
    resp.sendFile(path);
})
app.get("/admin-all-influ", function (req, resp) {
    let path = __dirname + "/public/admin-all-influ.html";
    resp.sendFile(path);
})
app.get("/fetch-all-emails", function (req, resp) {
    mysql.query("select distinct emailid from iprofile",
        function (err, resultjsonary) {
            if (err != null) {
                resp.send(err.message);
                return;
            }
            resp.send(resultjsonary);
        })
})
app.get("/fetch-all", function (req, resp) {
    mysql.query("select * from iprofile", function (err, resultjsonary) {
        if (err != null) {
            resp.send(err.message);
            return;
        }
        resp.send(resultjsonary);
    })
})
app.get("/fetch-some", function (req, resp) {
    mysql.query("select * from iprofile where emailid=?", [req.query.email], function (err, resultjsonary) {
        if (err != null) {
            resp.send(err.message);
            return;
        }
        resp.send(resultjsonary);
    })
})
app.get("/del-one", function (req, resp) {
    mysql.query("delete from iprofile where emailid=?", [req.query.email], function (err, resultjsonary) {
        if (err != null) {
            resp.send(err.message);
            return;
        }
        resp.send("deleted");
    })
})

app.get("/fetch-all-emailsu", function (req, resp) {
    mysql.query("select distinct email from users",
        function (err, resultjsonary) {
            if (err != null) {
                resp.send(err.message);
                return;
            }
            resp.send(resultjsonary);
        })
})
app.get("/fetch-allu", function (req, resp) {
    mysql.query("select * from users", function (err, resultjsonary) {
        if (err != null) {
            resp.send(err.message);
            return;
        }
        resp.send(resultjsonary);
    })
})
app.get("/fetch-someu", function (req, resp) {
    mysql.query("select * from users where email=?", [req.query.email], function (err, resultjsonary) {
        if (err != null) {
            resp.send(err.message);
            return;
        }
        resp.send(resultjsonary);
    })
})
app.get("/del-oneu", function (req, resp) {
    mysql.query("delete from users where email=?", [req.query.email], function (err, resultjsonary) {
        if (err != null) {
            resp.send(err.message);
            return;
        }
        resp.send("deleted");
    })
})
app.get("/do-block", function (req, resp) {
    mysql.query("update users set status='0' where email=?", [req.query.email], function (err, result) {
        if (err != null) {
            resp.send(err.message);
            return;
        }
        resp.send("blocked");
    })
})
app.get("/do-resume", function (req, resp) {
    mysql.query("update users set status='1' where email=?", [req.query.email], function (err, result) {
        if (err != null) {
            resp.send(err.message);
            return;
        }
        resp.send("resumed");

    })
})
app.get("/influ-finder", function (req, resp) {
    let path = __dirname + "/public/influ-finder.html";
    resp.sendFile(path);
})
/*app.get("/fetch-fields", function (req, resp) {
    mysql.query("select distinct fields from iprofile", function (err, resultjsonary) {
        if (err != null) {
            resp.send(err.message);
            return;
        }
        resp.send(resultjsonary);
    })
})*/
app.get("/fetch-cities", function (req, resp) {
    console.log("API called");
   // let field=req.query.fields;
    mysql.query("SELECT distinct city from iprofile where fields like ? ", ["%"+req.query.fields+"%"], function (err, jsonarray) {
        if (err != null) {
            resp.send(err.message);
            return;
        }
        resp.send(jsonarray);
    })
})
app.get("/search-influ", function (req, resp) {

    mysql.query("SELECT * FROM iprofile WHERE fields like ? and city=?", ["%"+req.query.fields+"%",req.query.city], function (err, jsonarray) {
        if (err) {
            resp.send(err.message);
            return;
        }
        console.log(JSON.stringify(jsonarray));
        resp.send(JSON.stringify(jsonarray));
    });
});
app.get("/search-influencer", function (req, resp) {

    mysql.query("SELECT * FROM iprofile WHERE iname like ?", ["%"+req.query.iname+"%"], function (err, jsonarray) {
        if (err) {
            resp.send(err.message);
            return;
        }
        console.log(JSON.stringify(jsonarray));
        resp.send(JSON.stringify(jsonarray));
    });
});
app.get("/events-manager",function(req,resp)
{
    let path=__dirname+"/public/events-manager.html";
    resp.sendFile(path);

});

//=======================

app.get("/efetch-all-emails", function (req, resp) {
    mysql.query("select distinct emailid from events",
        function (err, resultjsonary) {
            if (err != null) {
                resp.send(err.message);
                return;
            }
            resp.send(resultjsonary);
        })
})
app.get("/efetch-all", function (req, resp) {
    mysql.query("select * from events", function (err, resultjsonary) {
        if (err != null) {
            resp.send(err.message);
            return;
        }
        resp.send(resultjsonary);
    })
})
app.get("/efetch-some", function (req, resp) {
    mysql.query("select * from events where emailid=?", [req.query.email], function (err, resultjsonall) {
        if (err != null) {
            resp.send(err.message);
            return;
        }
        resp.send(resultjsonall);
    })
})
app.get("/edel-one", function (req, resp) {
    mysql.query("delete from events where emailid=?", [req.query.email], function (err, resultjsonary) {
        if (err != null) {
            resp.send(err.message);
            return;
        }
        resp.send("deleted");
    })
})
app.get("/client-profile",function(req,resp)
{
    let path=__dirname+"client-profile.html";
    resp.sendFile(path);
})
app.post("/save-processc", function (req, resp) {
    let emailid = req.body.txtemail;
    let cname = req.body.txtname;
    let city = req.body.txtcity;
    let state = req.body.txtstate;
    let io=req.body.txtio;
    let contact = req.body.txtcontact;
    mysql.query("insert into cprofile values(?,?,?,?,?,?)", [emailid, cname, city, state, io, contact], function (err, result) {
        if (err == null) {
            resp.redirect("result.html");
        }
        else
            resp.send(err.message);
    })
})
app.post("/update-processc", function (req, resp) {
    console.log(req.body);
    
    let emailid = req.body.txtemail;
    let cname = req.body.txtname;
    let city = req.body.txtcity;
    let state = req.body.txtstate;
    let io=req.body.txtio;
    let contact = req.body.txtcontact;
    mysql.query("update cprofile set cname=?,city=?,state=?,org=?,contact=? where email=?", [cname, city, state, io, contact,emailid], function (err, result) {
        if (err == null) {
            if (result.affectedRows >= 1) {
                resp.redirect("result.html");
            }
            else {
                resp.send("Invalid email id");
            }
        }
        else {
            resp.send(err.message);
        }
    })
})
app.get("/find-userc", function (req, resp) {
    let email = req.query.txtemail;
    mysql.query("select * from cprofile where email=?", [email], function (err, result) {
        if (err != null) {
            resp.send(err.message);
            return;
        }
        console.log(result);
        resp.send(result);
    })
})
