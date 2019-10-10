/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable no-script-url */
/* eslint-disable jsx-a11y/alt-text */
import React, { useEffect, useState } from 'react'
import data from './data.json'
import useSelectedProperties from './useSelectedProperties';
/**
 * 将规格属性分组，用于渲染
 * @param {object[]} properties
 * @return {object[]}
 */
const groupProperties = properties => properties
  .map(({ propId, propName }) => ({ propId, propName }))
  .filter((el, index, arr) => arr.findIndex(_el => _el.propId === el.propId) === index)
  .map(el => ({
    ...el,
    values: properties.filter(_el => _el.propId === el.propId).map(({ propId, propName, ...rest }) => rest)
  }))

/**
 * 初始化被选中的规格属性
 * @param {object[]} properties 
 * @param {object}
 */
const initialSelectedProperties = properties => properties
  .map(el => el.propId)
  .reduce((acc, cur) => {
    acc[cur] = undefined
    return acc
  }, {})

/**
 * 根据当前规格属性的选中情况，返回匹配的 sku，可能为多个
 * @param {object[]} skus 
 * @param {object[]} selectedProperties 
 * @return {object[]}
 */
const filterSelectedSkus = (skus, selectedProperties) => {

  // 将规格属性由对象转换为数组
  const selectedProductProps = Object
    .entries(selectedProperties)
    .map(([propId, valueId]) => ({ propId, valueId }))
    .filter(el => el.valueId) // 对象中，可能有规格属性值是 undefined

  // 非柯里化版本
  // const assertProperty = (assert, byAssert) => `${assert.propId}${assert.valueId}` === `${byAssert.propId}${byAssert.valueId}`
  // const filterSkus = sku => selectedProductProps.every(el => sku.productProps.find(_el => assertProperty(el, _el)))

  /**
   * 判断规格属性项与规格属性值是否完全一致。
   * 柯里化版本
   * @param {object} assert 
   * @return {function(object):boolean}
   */
  const assertProperty = assert => byAssert => `${assert.propId}${assert.valueId}` === `${byAssert.propId}${byAssert.valueId}`

  /**
   * 过滤包含指定规格属值的 sku
   * 指定的规格属性的所有值 every()，并须在 sku 的规格属性中全部被找到 find()。
   * @param {object[]} sku 
   * @return {boolean}
   */
  const filterSkus = sku => selectedProductProps.every(el => sku.productProps.find(assertProperty(el)))

  return skus.filter(filterSkus)
}

/**
 * 根据选中的 sku，返回对应的价格或价格区间
 * @param {object[]} skus 
 * @return {string}
 */
const getSkuPrice = skus => {
  const pricesRange = skus.map(el => el.sellPrice)
  const price = fn => (fn(...pricesRange) / 100).toFixed(2)
  const minimumPrice = price(Math.min)
  const maximumPrice = price(Math.max)
  return maximumPrice === minimumPrice ? maximumPrice : `${minimumPrice}-${maximumPrice}`
}

/**
 * 根据选中的 sku，返回对应的 sku 图片
 * @param {object[]} skus 
 * @return {string | undefined}
 */
const getSkuPicture = skus => {
  const pictures = skus
    .map(el => el.imgUrl)
    .filter((el, index, arr) => arr.indexOf(el) === index)
  return pictures.length > 1 ? undefined : pictures[0]
}

/**
 * 规格属性格式化输出
 * @param {object[]} properties 
 * @return {string}
 */
const stringfyProperties = properties => properties.map(({ propName, valueName }) => `${propName}：${valueName}`).join('，')

export default function MethodChanning() {
  const { data: { skus, productProps, spuImgs, productName } } = data
  const [mainPicture, setManPicture] = useState(spuImgs[0])
  const [selectedProperties, setSelectedProperties] = useSelectedProperties(initialSelectedProperties(productProps)) // {propId: valueId}

  const propertiesForRender = groupProperties(productProps)
  const selectedSkus = filterSelectedSkus(skus, selectedProperties)
  const price = getSkuPrice(selectedSkus)
  const picture = getSkuPicture(selectedSkus)
  console.log(productProps)
  console.log(JSON.stringify(propertiesForRender))

  useEffect(() => {
    picture && setManPicture(picture)
  }, [picture])


  const handleBuy = () => {
    if (selectedSkus.length > 1) return window.alert('请继续选择规格属性')
    window.alert(stringfyProperties(selectedSkus[0].productProps))
  }

  return (
    <div className='product'>
      <div className='container'>
        <div className='left'>
          <div className='main-picture'>
            <img src={mainPicture} />
          </div>
          <div className='pictures'>
            {
              spuImgs.map(el => (
                <div
                  key={el}
                  onMouseEnter={() => setManPicture(el)}
                >
                  <img src={el} />
                </div>
              ))
            }
          </div>
        </div>
        <div className='right'>
          <strong className='product-name'>{productName}</strong>
          <div className='price-range'>
            <div className='label'>价格</div>
            <div className='value'>¥ {price}</div>
          </div>
          {
            propertiesForRender.map(el =>
              <div
                className='property'
                key={el.propId}
              >
                <div className='label'>{el.propName}</div>
                <div className='value'>
                  {
                    el.values.map(_el => (
                      <label
                        key={_el.valueId}
                        className={selectedProperties[el.propId] === _el.valueId ? 'checked' : undefined}
                        htmlFor={_el.valueId}
                      >
                        {_el.valueName}
                        <input
                          type='checkbox'
                          id={_el.valueId}
                          value={_el.valueId}
                          checked={selectedProperties[el.propId] === _el.valueId}
                          onChange={
                            e => setSelectedProperties({
                              propId: el.propId,
                              valueId: e.target.checked ? _el.valueId : undefined
                            })
                          }
                        />
                      </label>
                    ))
                  }
                </div>
              </div>
            )
          }
          <a
            className='buy'
            href='javascript:void(0)'
            onClick={handleBuy}
          >立即购买</a>
        </div>
      </div>
    </div>
  )
}
