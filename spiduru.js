var page = require('webpage').create(),
    system = require('system'), 
    fs = require('fs'),
    start_episode, end_episode, anime_title, domain_name,
    start_link, url, download_links_holder=[], flag, link_output=[],
    i;
    
    
console.log("\n\n\n");
console.log(" ___ _ __ (_) __| |_   _ _ __ _   _ ");
console.log("/ __| '_ \\| |/ _` | | | | '__| | | |");
console.log("\\__ \\ |_) | | (_| | |_| | |  | |_| |  version: 1.0");
console.log("|___/ .__/|_|\\__,_|\\__,_|_|   \\__,_|  Anime website download link crawler ;)");
console.log("    |_|   ");
console.log("\n\n");

if(system.args.length === 1){
    console.log('\tUsage: phantomjs spiduru.js <starting episode> <ending episode> "<anime title>" "<site>"\n');
    console.log('\tExample: phantomjs spiduru.js 1 10 "one piece" "chia-anime"\n');
    phantom.exit();
}

/* user inputs */
start_episode = system.args[1];
end_episode = system.args[2];
anime_title = system.args[3].replace(/ /gi, "-").toLowerCase();
domain_name = system.args[4].replace(/ /gi, "-").toLowerCase();

console.log('Executing command: '+start_episode+' '+end_episode+' "'+anime_title+'" "'+domain_name+'"\n\t\tStarting Episode--> '+start_episode+'\n\t\tEnd Episode-------> '+end_episode+'\n\t\tAnime Title-------> '+anime_title+'\n\t\tAnime Site--------> '+domain_name+'\n\n');

/* check the domain */
switch(domain_name){
    case "gogoanime":
        start_link = 'https://www1.gogoanime.se/'+anime_title+'-episode-'+start_episode;
        checkAnimeExistence();
        break;
    case "chia-anime":
        start_link = 'http://ww2.chia-anime.tv/'+anime_title+'-episode-'+start_episode+'-english-subbed/';
        checkAnimeExistence();
        break;
    default:
        console.log(domain_name+' not in options');
        phantom.exit();
}
console.log(start_link);

/* check existense */
function checkAnimeExistence(){
    console.log('Checking anime existence: \nLoading. . .\n');
    //console.log(start_link);
    page.open(start_link,function(status){
        if(status !== 'success' || this.url !== start_link){
            console.log(anime_title+' NOT FOUND. CONNECTION ERROR. :(');
            phantom.exit();
        }else{
            console.log(anime_title+' FOUND. :)');
            crawl(start_episode,end_episode);
        }
    });
}

/* start crawling */
function crawl(start,end){

    if (start === end+1) {
        getLinks(0);
        return;
    }
    if(domain_name === "gogoanime"){
        url = 'https://www1.gogoanime.se/'+anime_title+'-episode-'+start;
        page.open(url,function(status){
            if(status !== 'success' || this.url !== url){
                console.log(url+' NOT CRAWLED. CONNECTION ERROR. :(');
                phantom.exit();
            }else{
                
                dl_link = this.evaluate(function(){
                        var x = document.querySelectorAll('div.download-anime a')[0].href;
                    return x;
                });
                download_links_holder.push(dl_link);
                console.log(dl_link+' CRAWLED. :)');
            }
            crawl(parseInt(start)+1,parseInt(end));
        });
    }else if(domain_name === "chia-anime"){
        url = 'http://ww2.chia-anime.tv/'+anime_title+'-episode-'+start+'-english-subbed/';
        page.open(url,function(status){
            if(status !== 'success' || this.url !== url){
                console.log(url+' NOT CRAWLED. CONNECTION ERROR. :(');
                phantom.exit();
            }else{
                
                dl_link = this.evaluate(function(){
                        var x = document.getElementById('download').href;
                    return x;
                });
                download_links_holder.push(dl_link);
                console.log(dl_link+' CRAWLED. :)');
            }
            crawl(parseInt(start)+1,parseInt(end));
        });
    }

}
/* get download links */
function getLinks(i) {

    if(i === download_links_holder.length){
        output();
        return;
    }
    if(domain_name === "gogoanime"){
    
        console.log(download_links_holder[i]);
        page.open(download_links_holder[i], function(){
            var current_episode = "Anime Title: "+anime_title+"\nEpisode: "+(parseInt(i)+1);
            var content = this.evaluate(function(){
                var download_btn_1 = document.querySelectorAll('div.dowload a')[0].href;
                var download_btn_name_1 = "Download fbcdn";
                var download_btn_2 = document.querySelectorAll('div.dowload a')[1].href;
                var download_btn_name_2 = document.querySelectorAll('div.dowload a')[1].innerHTML;
                var download_btn_3 = document.querySelectorAll('div.dowload a')[2].href;
                var download_btn_name_3 = document.querySelectorAll('div.dowload a')[2].innerHTML;
                var download_btn_4 = document.querySelectorAll('div.dowload a')[3].href;
                var download_btn_name_4 = document.querySelectorAll('div.dowload a')[3].innerHTML;
                
                return [download_btn_1,download_btn_name_1,download_btn_name_2,download_btn_2,download_btn_name_3,download_btn_3,download_btn_name_4,download_btn_4];
            });
            details = '\n\n'+current_episode+'\n'+content[1]+': '+content[0]+'\n\n'+content[2]+': '+content[3]+'\n\n'+content[4]+': '+content[5]+'\n\n'+content[6]+': '+content[7];
            link_output.push(details);
            getLinks(parseInt(i)+1);
        });

    }else if(domain_name === "chia-anime"){
        page.open(download_links_holder[i],function(){
            var current_episode = "Anime Title: "+anime_title+"\nEpisode: "+(parseInt(i)+1);
            var content = this.evaluate(function(){
                var download_btn_1 = document.querySelectorAll('th[scope="col"] a')[0].href;
                var download_btn_2 = document.querySelectorAll('th[scope="col"] a')[1].href;
                var download_btn_name_2 = document.querySelectorAll('th[scope="col"] a')[1].innerHTML;
                var download_btn_3 = document.querySelectorAll('th[scope="col"] a')[2].href;
                var download_btn_name_3 = document.querySelectorAll('th[scope="col"] a')[2].innerHTML;
                var download_btn_4 = document.querySelectorAll('th[scope="col"] a')[3].href;
                var download_btn_name_4 = document.querySelectorAll('th[scope="col"] a')[3].innerHTML;
                return [download_btn_1,download_btn_name_2,download_btn_2,download_btn_name_3,download_btn_3,download_btn_name_4,download_btn_4];
            });
            details = '\n\n'+current_episode+'\n\nDownload Link: '+content[0]+'\n\n'+content[1]+': '+content[2]+'\n\n'+content[3]+': '+content[4]+'\n\n'+content[5]+': '+content[6]+'\n\n';
            link_output.push(details);
            getLinks(parseInt(i)+1);
        });
    }

}
/* print links */
function output(){
    var filename = "links.txt";
    if(fs.exists(filename))
        fs.remove(filename);
    console.log('Links:');
    for(var i in link_output) {
        console.log(link_output[i]);
        fs.write(filename,link_output[i],'a');
    }
    console.log('\nLinks saved in links.txt');
    phantom.exit();
}



