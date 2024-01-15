import puppeteer from 'puppeteer'
import fs from 'fs'

async function extractAboutData(page: any, link: string) {
  await page.goto(link as string)
  const section1Data = await page.evaluate(() => {
    const section1 = document.querySelector('section:nth-of-type(1)')
    const paragraphs = section1 ? section1.querySelectorAll('p') : []
    const listItems = section1 ? section1.querySelectorAll('ul li') : []

    const paragraphData = Array.from(paragraphs).map((paragraph) => paragraph.textContent?.trim())
    const listData = Array.from(listItems).map((listItem) => listItem.textContent?.trim())

    return {
      paragraphs: paragraphData,
      listItems: listData,
    }
  })
  const section2Data = await page.evaluate(() => {
    const section2 = document.querySelector('section:nth-of-type(2)')
    const keyFactsListItems = section2 ? section2.querySelectorAll('ul li') : []

    const data = Array.from(keyFactsListItems).map((listItem) => listItem.textContent?.trim())

    return data
  })

  return { link, AboutData: section1Data, KeyFacts: section2Data }
}

async function extractLimitationsData(page: any, link: string) {
  await page.goto(link as string)
  const sectionData = await page.evaluate(() => {
    const sectionElement = document.querySelector('section')

    if (sectionElement) {
      const sectionText = sectionElement.innerText.trim()

      return sectionText.split('\n')
    }
  })

  return { link, Data: sectionData }
}

async function extractInstructionsData(page: any, link: string) {
  await page.goto(link as string)
  const sectionOneData = await page.evaluate(() => {
    const section1 = document.querySelector('section:nth-of-type(1)')
    const h2Items = section1 ? section1.querySelectorAll('h2') : []
    const pItems = section1 ? section1.querySelectorAll('p') : []
    const pData = Array.from(pItems).map((p) => p.textContent?.trim())
    const h2Data = Array.from(h2Items).map((h2) => h2.textContent?.trim())
    return {
      paragraphData: pData,
      headerData: h2Data,
    }
  })
  const sectionTwoData = await page.evaluate(() => {
    const section1 = document.querySelector('section:nth-of-type(2)')
    const h2Items = section1 ? section1.querySelectorAll('h2') : []
    const pItems = section1 ? section1.querySelectorAll('p') : []
    const pData = Array.from(pItems).map((p) => p.textContent?.trim())
    const h2Data = Array.from(h2Items).map((h2) => h2.textContent?.trim())
    return {
      paragraphData: pData,
      headerData: h2Data,
    }
  })

  return { link, sectionOneData, sectionTwoData }
}

async function extractSideEffectsData(page: any, link: string) {
  const sectionOneData = await page.evaluate(() => {
    const section1 = document.querySelector('section:nth-of-type(1)')
    const h2Items = section1 ? section1.querySelectorAll('h2') : []
    const pItems = section1 ? section1.querySelectorAll('p') : []
    const divContentLi = section1 ? section1.querySelectorAll('div .nhsuk-card__content ul li') : []
    const divContentP = section1 ? section1.querySelectorAll('div .nhsuk-card__content p') : []
    const pData = Array.from(pItems).map((p) => p.textContent?.trim())
    const h2Data = Array.from(h2Items).map((h2) => h2.textContent?.trim())
    const divContentData = Array.from(divContentLi)
      .map((data) => (data as HTMLElement).textContent?.trim())
      .concat(
        Array.from(divContentP).map((data) => {
          return (data as HTMLElement).textContent?.trim()
        }),
      )
    return {
      paragraphData: pData,
      headerData: h2Data,
      divContentData: divContentData,
    }
  })
  const sectionTwoData = await page.evaluate(() => {
    const section1 = document.querySelector('section:nth-of-type(1)')
    const h2Items = section1 ? section1.querySelectorAll('h2') : []
    const pItems = section1 ? section1.querySelectorAll('p') : []
    const divContentLi = section1 ? section1.querySelectorAll('div .nhsuk-card__content ul li') : []
    const divContentP = section1 ? section1.querySelectorAll('div .nhsuk-card__content p') : []
    const pData = Array.from(pItems).map((p) => p.textContent?.trim())
    const h2Data = Array.from(h2Items).map((h2) => h2.textContent?.trim())
    const divContentData = Array.from(divContentLi)
      .map((data) => (data as HTMLElement).textContent?.trim())
      .concat(
        Array.from(divContentP).map((data) => {
          return (data as HTMLElement).textContent?.trim()
        }),
      )
    return {
      paragraphData: pData,
      headerData: h2Data,
      divContentData: divContentData,
    }
  })

  return { link, sectionOneData, sectionTwoData }
}

async function ScrapeNhsMeds() {
  const browser = await puppeteer.launch({ headless: 'new' })
  const page = await browser.newPage()
  await page.goto('https://www.nhs.uk/medicines/')
  console.log('Scraping NHS medicines...')

  await page.waitForSelector('.nhsuk-list li a')
  const medicines = await page.evaluate(() => {
    const medicineNodes = document.querySelectorAll('.nhsuk-list li a')
    // TODO: fix any type
    const medicinesArray: any[] = []

    medicineNodes.forEach((node) => {
      const name: string | undefined = node.textContent?.trim()
      const link = node.getAttribute('href')
      if (name && name.length > 1 && link) {
        medicinesArray.push({ name, link })
      }
    })

    return medicinesArray
  })

  // TODO:  fix any type
  const medicineDetails: any = {}

  for (const { name, link } of medicines) {
    await page.goto(`https://www.nhs.uk${link}`)

    const details = await page.evaluate(() => {
      const properties = document.querySelectorAll('.nhsuk-u-reading-width li a')
      const detailsObj: any = {}
      const descriptionCategories = {
        About: 'About',
        'Who can and cannot': 'Limitations',
        'How and when': 'Instructions',
        'Side effects': 'Side effects',
        'Pregnancy, breastfeeding': 'Pregnancy and breastfeeding',
        'other medicines': 'Using with other medicines',
        'Common questions': 'Common questions',
      }

      properties.forEach(async (property) => {
        const title: string | undefined = property.textContent?.trim()
        const link = property.getAttribute('href')
        if (title && link) {
          for (const [key, value] of Object.entries(descriptionCategories)) {
            if (title.includes(key)) {
              detailsObj[value] = link
            }
          }
        }
      })

      return detailsObj
    })

    for (const [name, link] of Object.entries(details)) {
      if (name === 'About') {
        details[name] = await extractAboutData(page, link as string)
      } else if (name === 'Limitations') {
        details[name] = await extractLimitationsData(page, link as string)
      } else if (name === 'Instructions') {
        details[name] = await extractInstructionsData(page, link as string)
      } else if (name === 'Side effects') {
        details[name] = await extractSideEffectsData(page, link as string)
      } else if (name === 'Pregnancy and breastfeeding') {
        // Handle Pregnancy and breastfeeding
      } else if (name === 'Using with other medicines') {
        // Handle Using with other medicines
      } else if (name === 'Common questions') {
        // Handle Common questions
      }
    }

    if (Object.keys(details).length === 0) {
      medicineDetails[name] = { link, details: { error: 'No details found' } }
    } else {
      medicineDetails[name] = { link, details }
    }
  }

  await browser.close()

  const jsonBundle = JSON.stringify(medicineDetails, null, 2)
  fs.writeFileSync('./output/medicine-details.json', jsonBundle)

  console.log('JSON bundle has been created: medicine-details.json')
}

export default ScrapeNhsMeds
