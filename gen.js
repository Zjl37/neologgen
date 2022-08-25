const frm = document.querySelector(".neolog-iframe");

const ditEpoch = new Date(2017, 8, 1);

function StripTimeFromDate(d) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function NextMonday(d) {
  let d2 = new Date(d);
  d2.setDate(d.getDate() + ((7 - d.getDay()) % 7 + 1) % 7);
  return d2;
};

var initday = StripTimeFromDate(NextMonday(new Date()));

const wdName = '日一二三四五六';

function MyFormatDate(d) {
  return `${d.getMonth()+1}-${d.getDate()} ${wdName[d.getDay()]}`;
}

function GetDitDay(d) {
  return Math.trunc((StripTimeFromDate(d).getTime() - ditEpoch.getTime())/24/3600/1000) + 1;
}

function NeologUpdate() {
  for(let i = 1; i <= 4; i++) {
    rowdate = frmdoc.querySelector(`.page${i} .log_row_date`);
    rowdit = frmdoc.querySelector(`.page${i} .log_row_dit`);
    for(let j = 0; j < rowdate.children.length; j++) {
      let d = new Date(initday.getTime() + ((i-1)*7 + j)*24*3600*1000);
      // console.log(d);
      rowdate.children[j].innerHTML = MyFormatDate(d);
      // console.log(rowdate.children[j].innerHTML);
      rowdit.children[j].innerHTML = String(GetDitDay(d));
    }
  }
}

function TogglePageVis(x) {
  console.log(`TogglePageVis(${x})`);
  e = document.querySelector(`#pvcb${x}`);
  frmdoc.querySelector(`.page${x}`).style.visibility = e.checked ? "visible" : "hidden";
}

function MakePageVisCtrl() {
  ctrl = document.querySelector(`.ctrl-page-visibility`);
  for(let i = 1; i <= 4; i++) {
    e = document.createElement("input");
    e.setAttribute("type", "checkbox");
    e.setAttribute("id", `pvcb${i}`);
    e.setAttribute("checked", "checked");
    e.onclick = () => TogglePageVis(i);
    ctrl.appendChild(e);

    e = document.createElement("label");
    e.setAttribute("for", `pvcb${i}`);
    e.innerHTML = `显示第${i}页`;
    ctrl.appendChild(e);
  }
}

function MakeInitDateCtrl() {
  document.querySelector("#btnDecInitDate")
    .onclick = function() {
      initday.setDate(initday.getDate() - 7);
      NeologUpdate();
    };
  document.querySelector("#btnIncInitDate")
    .onclick = function() {
      initday.setDate(initday.getDate() + 7);
      NeologUpdate();
    };
}

function UpdateSchedule() {
  let txt = document.querySelector("#schedule-textarea").value;
  let sch = Array.from(txt.split(/\r?\n/), (ln) => ln.split(','));
  console.log(sch);
  for(let i = 1; i <= 4; ++i) {
    const rows = frmdoc.querySelectorAll(`.page${i} .log_table .log_row_lesson`);
    let y = 0;
    for(let row of rows) {
      for(let j = row.children.length; j < 7; j++) {
        row.appendChild(frmdoc.createElement('td'));
      }
      for(let x = 0; x < 7; x++) {
        row.children[x].innerHTML = sch[x][y]?sch[x][y]:"";
      }
      y++;
    }
  }
}

function FetchSchedule() {
  let ta = document.querySelector("#schedule-textarea");
  fetch('schedule.txt').then(resp => {
    if(resp.ok) {
      return (async () => resp)();
    }
    return fetch('schedule-example.txt');
  }).then(resp => resp.text()).then(data => {
    ta.value = data;
  }).then(() => UpdateSchedule());
}

frm.addEventListener("load", function() {
  window.frmdoc = frm.contentDocument;
  NeologUpdate();
  MakePageVisCtrl();
  MakeInitDateCtrl();
  FetchSchedule();
});

