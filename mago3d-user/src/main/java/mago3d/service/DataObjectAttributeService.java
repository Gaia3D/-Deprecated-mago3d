package mago3d.service;

import mago3d.domain.DataObjectAttribute;
import mago3d.domain.DataObjectAttributeFileInfo;

/**
 * 데이터 파일 속성 관리
 * @author jeongdae
 *
 */
public interface DataObjectAttributeService {
	
	/**
	 * 데이터 Object 속성 정보를 취득
	 * @param dataId
	 * @return
	 */
	DataObjectAttribute getDataObjectAttribute(Long dataId);
	
}