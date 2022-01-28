//"data.include"속성을 갖는 모든 요소에 대한 탐색
document.querySelectorAll("*[data-include]").forEach( async (v,i) => {
    const include = v.dataset.include;
    let html = null;

    try{
        // html 파일을 받아온다.
        const response = await axios.get(include);
        html = response.data;
    } catch (e) {
        console.error(e);
    }
    // outerjoin으로 태그 전체를 바꾼다.
    if(html != null){
        v.outerHTML = html;
    }
})