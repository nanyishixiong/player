(async () => {
  // 视频控制器
  const plyr = new Plyr("#player");
  let currentFileIndex = 0; // 当前播放视频的索引

  const selector = document.getElementById("selector");
  const frag = document.createDocumentFragment();

  // 取到当前项
  currentFileIndex = await (await fetch("http://127.0.0.1:8081/getCurrentIndex")).json();

  const files = await (await fetch("http://127.0.0.1:8081/result.json")).json();

  function dfs(files, container) {
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file instanceof Array) {
        const optgroup = document.createElement("div");
        optgroup.label = "————————";
        dfs(file, optgroup);
        container.appendChild(optgroup);
      } else {
        const option = document.createElement("option");
        option.value = file.url;
        option.innerText = file.label;
        option.setAttribute("data-index", i);
        container.appendChild(option);
      }
    }
  }

  dfs(files, frag);
  selector.appendChild(frag);

  // 播放对应索引的视频
  function playVideo(files, index) {
    currentFileIndex = index;
    selector.selectedIndex = index;
    plyr.source = {
      type: "video",
      sources: [
        {
          src: files[index].url,
          type: "video/mp4"
        }
      ]
    };
    plyr.play();
    fetch(`http://127.0.0.1:8081/saveCurrentIndex?current=${index}`);
  }

  // 进度控制
  document.addEventListener("keydown", (event) => {
    // 右键
    if (event.keyCode === 39) {
      console.log("右键");
      // 如果视频已经结束，播放下一集
      if (plyr.ended) {
        console.log("end111");
        playVideo(files, currentFileIndex + 1);
      } else {
        // 快进
        plyr.forward();
        if (plyr.paused) plyr.play();
      }
    }
    // 左键
    if (event.keyCode === 37) {
      console.log("左键");
      plyr.rewind();
      if (plyr.paused) plyr.play();
    }
    // 空格
    if (event.keyCode === 32) {
      console.log("空格");
      if (plyr.playing) {
        plyr.pause();
      } else {
        plyr.play();
      }
    }
  });

  selector.addEventListener("change", (e) => {
    playVideo(files, e.target.selectedIndex);
  });

  //首次加载，取第一个文件
  setTimeout(() => {
    playVideo(files, currentFileIndex);
  }, 0);
})();
