// in the console
const d = [...document.getElementsByClassName("panel-heading card-header")].map((e)=>{
    e.click()
    const v = e.nextElementSibling?.querySelector(".panel-body");
    return {
        course: e.innerText.replace(" expand_more", "") || "",
        institution: v?.children?.[1].innerHTML || "",
        language: v?.children?.[3].innerHTML || "",
        categories: v?.children?.[5].innerText.split("\n").filter((a)=> a.trim() !== "").map(b=>b.trim()) || "",
    }
});
console.log(d)
JSON.stringify(d)
